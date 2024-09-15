> ### Link del [Tutorial](https://reactrouter.com/en/main/start/tutorial#tutorial) original de React Router

# Tutorial 

## ¡Bienvenido al tutorial! 
Construiremos una aplicación pequeña pero rica en funciones que le permite realizar un seguimiento de sus contactos. Esperamos que tome entre 30-60 m si está siguiendo.
> ### 👉 ¡Cada vez que veas esto significa que necesitas hacer algo en la aplicación!
>Estaremos usando Vite para nuestro bundler y servidor de desarrollo para este tutorial. Necesitarás Node.js y npm.
### Abra su terminal y arranque una nueva aplicación React con Vite:
```
npm create vite@latest name-of-your-project -- --template react
```
### Siga las instrucciones
```
cd <your new project directory>

# Necesario
npm install react-router-dom 

npm install --save prop-types

# solo para este tutorial.
npm install localforage  
npm install match-sorter
npm install sort-by 

npm run dev
```
Debería poder visitar la URL impresa en el terminal:
```
 VITE v3.0.7  ready in 175 ms

  ➜  Local:   http://127.0.0.1:5173/

  ➜  Network: use --host to expose
```

Este tutorial será para crear, leer, buscar, actualizar y eliminar datos. Una aplicación web típica probablemente estaría hablando con una API en su servidor web, pero vamos a usar el almacenamiento del navegador y simular algo de latencia de red para mantener esto enfocado. Ninguno de estos códigos es relevante para React Router, así que sigue adelante y cópialo/péguelo todo.

Estructura de carpetas y archivos propuesta para el src.
```
src/
├── loaderAction/
│   └── loaderAction.js
├── routes/
│   ├── contact.jsx
│   ├── destroy.jsx
│   ├── edit.jsx
│   ├── index.jsx
│   └── root.jsx
├── contacts.js
├── error-page.jsx
├── index.css
├── App.jsx
└── main.jsx
```

Todo lo que necesita para iniciar en la carpeta src son los archivos contacts.js, main.jsx, y index.css. Puede eliminar cualquier otra cosa (como app.css, assets, etc.).

> ### 👉 Eliminar archivos no utilizados en src/ así que todo lo que te queda son estos:

```
src
├── contacts.js
├── index.css
├── App.jsx
└── main.jsx
```
> # 🚨
> 
> Si su aplicación se está ejecutando, podría explotar momentáneamente, solo siga 😋. ¡Y con eso, estamos listos para empezar!

## Agregar un Router
Lo primero que debe hacer es crear un Enrutador del Navegador y configurar nuestra primera ruta. Esto permitirá el enrutamiento del lado del cliente para nuestra aplicación web.

El el archivo main.jsx es el punto de entrada. Ábrelo y pondremos React Router en la página.

### 👉 Crear y renderizar un enrutador del navegador en main.jsx
```
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={App} />
  </StrictMode>,
);
```

```
// App.jsx
import {  createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import { 
  loader as rootLoader,
  action as rootAction,
  loaderContac as contactLoader,
  actionEdit as editAction,
  actionContac as contactAction,
} from "./loaderAction/loaderAction.js"

import Index from "./routes/index";
import EditContact from "./routes/edit";
import Contact from "./routes/contact";
import { action as destroyAction } from "./routes/destroy";
import ErrorPage from "./error-page";

const App = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage/>,
        children: [
          { index: true, element: <Index/> },
          {
            path: "contacts/:contactId",
            element: <Contact/>,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact/>,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
        ],
      }
    ]
  },
]);

export default App
```
Esta primera ruta es lo que a menudo llamamos la "ruta raíz", ya que el resto de nuestras rutas se renderizarán dentro de ella. Servirá como el diseño raíz de la UI, tendremos diseños anidados a medida que avanzamos.

### La Ruta Raíz
Agreguemos el diseño global para esta aplicación.

### 👉 Crear src/routes y src/routes/root.jsx
```
mkdir src/routes

touch src/routes/root.jsx
```
>(Si no quieres ser un nerd de línea de comandos, usa tu editor en lugar de esos comandos 🤓)

### 👉 Cree el componente de diseño raíz root.jsx.
```
// root.jsx
import { useEffect } from "react";
import { Outlet, NavLink, useLoaderData, Form, useNavigation, useSubmit } from "react-router-dom";

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has( "q" );

  useEffect(() => { document.getElementById("q").value = q }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input id="q" className={searching ? "loading" : ""} aria-label="Search contacts" placeholder="Search" type="search" name="q" defaultValue={q}
              onChange={(event) => { 
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, { replace: !isFirstSearch });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite" ></div>
          </Form>
          <Form method="post"> <button type="submit">New</button> </Form>
        </div>
        <nav>
        {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                <NavLink to={`contacts/${contact.id}`} className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : "" } >
                    {contact.first || contact.last ? (
                      <> {contact.first} {contact.last} </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p> <i>No contacts</i> </p>
          )}
        </nav>
      </div>
      <div id="detail" className={ navigation.state === "loading" ? "loading" : "" } > <Outlet /> </div>
    </>
  );
};
```

> Nada de React Router específico todavía, así que siéntase libre de copiar/pegar todo eso.

### 👉 Establecer en el "element" el "Root" como la ruta raíz.
```
// App.jsx
import Root from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);
```

### Manejo de Errores No Encontrados.
¡Siempre es una buena idea saber cómo responde su aplicación a los errores al principio del proyecto porque todos escribimos muchos más errores que características al crear una nueva aplicación! Sus usuarios no solo obtendrán una buena experiencia cuando esto suceda, sino que también lo ayudarán durante el desarrollo.

¿Agregamos algunos enlaces a esta aplicación, veamos qué sucede cuando hacemos clic en ellos?

### 👉 Haga clic en uno de los nombres de la barra lateral

captura de pantalla del elemento de error predeterminado React Router
¡Grasso! Esta es la pantalla de error predeterminada en React Router, empeorada por nuestros estilos de caja flexible en el elemento raíz en esta aplicación 😂.

Cada vez que su aplicación arroje un error al renderizar, cargar datos o realizar mutaciones de datos, React Router lo detectará y representará una pantalla de error. Hagamos nuestra propia página de error.

### 👉 Crear un componente de página de error
```
touch src/error-page.jsx
```
```
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
```
### 👉 Establecer el ```<ErrorPage>``` como el errorElement en la ruta raíz.
```
/* previous imports */
import ErrorPage from "./error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

Tenga en cuenta que useRouteError proporciona el error que se lanzó. Cuando el usuario navega a rutas que no existen, obtendrá un respuesta de error con un "No Encontrado" statusText. Veremos algunos otros errores más adelante en el tutorial y los discutiremos más.

Por ahora, es suficiente saber que casi todos sus errores ahora serán manejados por esta página en lugar de hilanderos infinitos, páginas que no responden o pantallas en blanco 🙌

### La Ruta de Contacto UI
En lugar de una página 404 "No encontrado", queremos representar algo en las URL a las que hemos vinculado. Para eso, necesitamos hacer una nueva ruta.

### 👉 Crea el módulo de ruta de contacto
```
touch src/routes/contact.jsx
```
### 👉 Agregue el componente de contacto UI

Es solo un montón de elementos, siéntase libre de copiar/pegar.
```
import { Form } from "react-router-dom";

export default function Contact() {
  const contact = {
    first: "Your",
    last: "Name",
    avatar: "https://robohash.org/you.png?size=200x200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}
```
Ahora que tenemos un componente, vamos a conectarlo a una nueva ruta.

### 👉 Importe el componente de contacto y cree una nueva ruta
```
/* existing imports */
import Contact from "./routes/contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "contacts/:contactId",
    element: <Contact />,
  },
]);

/* existing code */
```
Ahora si hacemos clic en uno de los enlaces o visita /contacts/1 ¡obtenemos nuestro nuevo componente!

> Renderizado de ruta de contacto sin el diseño principal.

> Sin embargo, no está dentro de nuestro diseño raíz 😠

### Rutas Anidadas
Queremos que el componente de contacto se renderice dentro de la <Root> diseño como este.

Lo hacemos haciendo que la ruta de contacto sea una niño de la ruta raíz.

### 👉 Mueva la ruta de contactos para ser un hijo de la ruta raíz
```
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
    ],
  },
]);
```
Ahora verá el diseño raíz nuevamente, pero una página en blanco a la derecha. Necesitamos decir la ruta raíz donde queremos que haga sus rutas infantiles. Hacemos eso con <Outlet>.

### Encuentra el ```<div id="detail">``` y pon una salida dentro

### 👉 Renderizar un ```<Outlet>```
```
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      {/* all the other elements */}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
```
### Enrutamiento del Lado del Cliente
Puede que lo hayas notado o no, pero cuando hacemos clic en los enlaces en la barra lateral, el navegador está haciendo una solicitud de documento completa para la siguiente URL en lugar de usar React Router.

El enrutamiento del lado del cliente permite que nuestra aplicación actualice la URL sin solicitar otro documento del servidor. En cambio, la aplicación puede renderizar inmediatamente una nueva interfaz de usuario. Hagamos que suceda con <Link>.

### 👉 Cambia la barra lateral ```<a href> a <Link to>```
```
import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id="sidebar">
        {/* other elements */}

        <nav>
          <ul>
            <li>
              <Link to={`contacts/1`}>Your Name</Link>
            </li>
            <li>
              <Link to={`contacts/2`}>Your Friend</Link>
            </li>
          </ul>
        </nav>

        {/* other elements */}
      </div>
    </>
  );
}
```
Puede abrir la pestaña de red en las herramientas de desarrollo del navegador para ver que ya no solicita documentos.

### Cargando Datos
Los segmentos de URL, diseños y datos están más a menudo que no acoplados (¿triplicados?) juntos. Ya podemos verlo en esta aplicación:

### Segmento de URL	Componente	Datos
```
> /	<Root>	lista de contactos
> contactos/:id	<Contact>	contacto individual
```
Debido a este acoplamiento natural, React Router tiene convenciones de datos para obtener datos en sus componentes de ruta fácilmente.

> ### Hay dos API que usaremos para cargar datos, el loader y useLoaderData. 
> ### Primero crearemos y exportaremos una función de cargador en el módulo raíz, luego la conectaremos a la ruta. Finalmente, accederemos y renderizaremos los datos.

### 👉 Exportar un cargador desde root.jsx
```
import { Outlet, Link } from "react-router-dom";
import { getContacts } from "../contacts";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}
```
### 👉 Configure el cargador en la ruta
```
/* other imports */
import Root, { loader as rootLoader } from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
    ],
  },
]);
```
### 👉 Acceda y renderice los datos
```
import {
  Outlet,
  Link,
  useLoaderData,
} from "react-router-dom";
import { getContacts } from "../contacts";

/* other code */

export default function Root() {
  const { contacts } = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        {/* other code */}

        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>

        {/* other code */}
      </div>
    </>
  );
}
```
>### ¡Eso es todo! React Router ahora mantendrá automáticamente esos datos sincronizados con su UI. Todavía no tenemos datos, por lo que probablemente esté obteniendo una lista en blanco como esta:

### Escribe datos + Formularios HTML.
Crearemos nuestro primer contacto en un segundo, pero primero hablemos de HTML.

React Router emula la navegación HTML Form como la mutación de datos primitiva, según el desarrollo web antes de la explosión cambriana de JavaScript. Le brinda las capacidades UX de las aplicaciones renderizadas por el cliente con la simplicidad del modelo web de "vieja escuela".

Aunque no son familiares para algunos desarrolladores web, los formularios HTML en realidad causan una navegación en el navegador, al igual que hacer clic en un enlace. La única diferencia está en la solicitud: los enlaces solo pueden cambiar la URL, mientras que los formularios también pueden cambiar el método de solicitud (GET vs POST) y el cuerpo de solicitud (DAtos del formulario POST).

Sin enrutamiento del lado del cliente, el navegador serializará los datos del formulario automáticamente y los enviará al servidor como el cuerpo de solicitud de POST, y como URLSearchParams para GET. React Router hace lo mismo, excepto que en lugar de enviar la solicitud al servidor, utiliza el enrutamiento del lado del cliente y la envía a una ruta action.

Podemos probar esto haciendo clic en el botón "Nuevo" en nuestra aplicación. La aplicación debe explotar porque el servidor Vite no está configurado para manejar una solicitud POST (envía un 404, aunque probablemente debería ser un 405 🤷).

En lugar de enviar ese POST al servidor Vite para crear un nuevo contacto, usemos el enrutamiento del lado del cliente.

### Creación de Contactos.
Crearemos nuevos contactos exportando un action en nuestra ruta raíz, conectándola a la configuración de la ruta y cambiando nuestra ```<form>``` para un Router React ```<Form>```.

### 👉 Crea la acción y cambia ```<form> a <Form>```
```
import {
  Outlet,
  Link,
  useLoaderData,
  Form,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export async function action() {
  const contact = await createContact();
  return { contact };
}

/* other code */

export default function Root() {
  const { contacts } = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          {/* other code */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>

        {/* other code */}
      </div>
    </>
  );
}
```
### 👉 Importar y establecer la acción en la ruta
```
/* other imports */

import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
    ],
  },
]);
```
>¡Eso es todo! Siga adelante y haga clic en el botón "Nuevo" y debería ver un nuevo disco aparecer en la lista 🥳

El createContact el método simplemente crea un contacto vacío sin nombre ni datos ni nada. ¡Pero todavía crea un disco, promesa!

>🧐 Espera un segundo ... ¿Cómo se actualizó la barra lateral? Dónde llamamos al action¿? ¿Dónde está el código para refetch los datos? Dónde están useState, onSubmit y useEffect¡?!

Aquí es donde aparece el modelo de programación de la "web de la vieja escuela". 

Como discutimos anteriormente, ```<Form>``` evita que el navegador envíe la solicitud al servidor y la envía a su ruta action en cambio. 

En semántica web, un POST generalmente significa que algunos datos están cambiando. 

Por convención, React Router utiliza esto como una pista para revalidar automáticamente los datos en la página después de que la acción termina. 

> ### Eso significa todo tu useLoaderData ¡actualización de ganchos y la interfaz de usuario se mantiene sincronizada con sus datos automáticamente

>! Bastante genial.

## Parámetros de URL en Cargadores.
### 👉 Haga clic en el registro Sin nombre

Deberíamos volver a ver nuestra antigua página de contacto estática, con una diferencia: la URL ahora tiene un ID real para el registro.

Al revisar la configuración de la ruta, la ruta se ve así:
```
[
  {
    path: "contacts/:contactId",
    element: <Contact />,
  },
];
```
Nota el :contactId segmento de URL. El colon (:) tiene un significado especial, convirtiéndolo en un "segmento dinámico". Los segmentos dinámicos coincidirán con los valores dinámicos (cambiantes) en esa posición de la URL, como el ID de contacto. Llamamos a estos valores en la URL "URL Params", o simplemente "params" para abreviar.

Estos params se pasan al cargador con teclas que coinciden con el segmento dinámico. Por ejemplo, nuestro segmento se nombra :contactId entonces el valor se pasará como params.contactId.

Estos parámetros se utilizan con mayor frecuencia para encontrar un registro por ID. Probémoslo.

### 👉 Agregue un cargador a la página de contacto y acceda a los datos con useLoaderData
```
import { Form, useLoaderData } from "react-router-dom";
import { getContact } from "../contacts";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  return { contact };
}

export default function Contact() {
  const { contact } = useLoaderData();
  // existing code
}
```
### 👉 Configure el cargador en la ruta
```
/* existing code */
import Contact, {
  loader as contactLoader,
} from "./routes/contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
    ],
  },
]);

/* existing code */
```
### Actualización de Datos
Al igual que la creación de datos, actualiza los datos con ```<Form>```. 

> ### Hagamos una nueva ruta en contacts/:contactId/edit. 

Nuevamente, comenzaremos con el componente y luego lo conectaremos a la configuración de ruta.

### 👉 Crear el componente de edición
```
touch src/routes/edit.jsx
```
### 👉 Agregar la página de edición UI

Nada que no hayamos visto antes, no dude en copiar/pegar:
```
import { Form, useLoaderData } from "react-router-dom";

export default function EditContact() {
  const { contact } = useLoaderData();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact?.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact?.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}
```
### 👉 Añadir la nueva ruta de edición
```
/* existing code */
import EditContact from "./routes/edit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
      },
    ],
  },
]);

/* existing code */
```
Queremos que se represente en la salida de la ruta raíz, por lo que lo convertimos en hermano de la ruta infantil existente.

(Puede notar que reutilizamos el contactLoader para esta ruta. Esto es solo porque estamos siendo perezosos en el tutorial. No hay razón para intentar compartir cargadores entre rutas, generalmente tienen las suyas.)

Muy bien, haciendo clic en el botón "Editar" nos da esta nueva UI:

### Actualización de contactos con FormData.
La ruta de edición que acabamos de crear ya representa un formulario. Todo lo que tenemos que hacer para actualizar el registro es conectar una acción a la ruta. El formulario se publicará en la acción y los datos se revalidarán automáticamente.

### 👉 Agregue una acción al módulo de edición
```
import {
  Form,
  useLoaderData,
  redirect,
} from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

/* existing code */
👉 Conecta la acción a la ruta

/* existing code */
import EditContact, {
  action as editAction,
} from "./routes/edit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
    ],
  },
]);

/* existing code */
```
> ¡Llene el formulario, presione guardar, y debería ver algo como esto! (Excepto más fácil en los ojos y tal vez menos peludo.)

## Mutación Discusión.
### 😑 Funcionó, pero no tengo idea de lo que está pasando aquí...

Vamos a cavar un poco...

> Abrir src/routes/edit.jsx y mira los elementos de la forma. 

> Observe cómo cada uno tiene un nombre:
```
<input
  placeholder="First"
  aria-label="First name"
  type="text"
  name="first"
  defaultValue={contact.first}
/>
```
Sin JavaScript, cuando se envía un formulario, el navegador creará FormData y configúrelo como el cuerpo de la solicitud cuando lo envía al servidor. Como se mencionó anteriormente, React Router lo evita y envía la solicitud a su acción, incluido el FormData.

Cada campo en el formulario es accesible con formData.get(name). Por ejemplo, dado el campo de entrada desde arriba, puede acceder al nombre y apellidos como este:
```
export async function action({ request, params }) {
  const formData = await request.formData();
  const firstName = formData.get("first");
  const lastName = formData.get("last");
  // ...
}
```
Como tenemos un puñado de campos de formulario, usamos Object.fromEntries para recogerlos todos en un objeto, que es exactamente lo que nuestro updateContact la función quiere.
```
const updates = Object.fromEntries(formData);
updates.first; // "Some"
updates.last; // "Name"
```
Aparte de action, ninguna de estas API que estamos discutiendo es proporcionada por React Router: request, request.formData, Object.fromEntries todos son proporcionados por la plataforma web.

Después de que terminamos la acción, tenga en cuenta el redirect al final:
```
export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
```
Los cargadores y las acciones pueden ambos devolver a Response (tiene sentido, ya que recibieron un Request!). El redirect helper solo facilita el retorno de un respuesta eso le dice a la aplicación que cambie de ubicación.

Sin enrutamiento del lado del cliente, si un servidor redirige después de una solicitud POST, la nueva página obtendrá los datos más recientes y se renderizará. Como aprendimos antes, React Router emula este modelo y revalida automáticamente los datos en la página después de la acción. Es por eso que la barra lateral se actualiza automáticamente cuando guardamos el formulario. ¡El código de revalidación adicional no existe sin el enrutamiento del lado del cliente, por lo que tampoco necesita existir con el enrutamiento del lado del cliente!

Redirigir nuevos registros a la página de edición
Ahora que sabemos redirigir, actualicemos la acción que crea nuevos contactos para redirigir a la página de edición:

### 👉 Redirigir a la página de edición del nuevo registro
```
import {
  Outlet,
  Link,
  useLoaderData,
  Form,
  redirect,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}
```
Ahora, cuando hacemos clic en "Nuevo", deberíamos terminar en la página de edición:

### 👉 Agregue un puñado de registros

Voy a usar la alineación estelar de oradores de la primera Conferencia Remix 😁

Estilo de Enlace Activo
Ahora que tenemos un montón de registros, no está claro cuál estamos viendo en la barra lateral. Podemos usar NavLink para arreglar esto.

### 👉 Usar a NavLink en la barra lateral
```
import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
} from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id="sidebar">
        {/* other code */}

        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    {/* other code */}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>{/* other code */}</p>
          )}
        </nav>
      </div>
    </>
  );
}
```
Tenga en cuenta que estamos pasando una función a className. Cuando el usuario está en la URL en el NavLink, entonces isActive será cierto. Cuando es sobre para estar activo (los datos siguen cargando) entonces isPending será cierto. Esto nos permite indicar fácilmente dónde está el usuario, así como proporcionar comentarios inmediatos sobre los enlaces en los que se ha hecho clic, pero aún estamos esperando que se carguen los datos.

## UI Global Pendiente.
A medida que el usuario navega por la aplicación, React Router lo hará deja la página anterior arriba como los datos se cargan para la página siguiente. Es posible que haya notado que la aplicación no responde un poco al hacer clic entre la lista. Proporcionemos al usuario algunos comentarios para que la aplicación no no responda.

React Router está administrando todo el estado detrás de escena y revela las piezas que necesita para crear aplicaciones web dinámicas. En este caso, usaremos el useNavigation gancho.

### 👉 useNavigation para agregar UI pendiente global
```
import {
  // existing code
  useNavigation,
} from "react-router-dom";

// existing code

export default function Root() {
  const { contacts } = useLoaderData();
  const navigation = useNavigation();

  return (
    <>
      <div id="sidebar">{/* existing code */}</div>
      <div
        id="detail"
        className={
          navigation.state === "loading" ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}
```
> ### ```useNavigation``` devuelve el estado de navegación actual : 
> ### Puede ser uno de ```"idle" | "submitting" | "loading"```.

En nuestro caso, agregamos una `clase "loading"` a la parte principal de la aplicación si no estamos inactivos. El CSS luego agrega un buen desvanecimiento después de un breve retraso (para evitar parpadear la interfaz de usuario para cargas rápidas). Sin embargo, puedes hacer lo que quieras, como mostrar una hilandera o una barra de carga en la parte superior.

Tenga en cuenta que nuestro modelo de datos `(src/contacts.js)` tiene una caché de cliente, por lo que navegar al mismo contacto es rápido la segunda vez. Este comportamiento es no React Router, volverá a cargar datos para cambiar rutas sin importar si ha estado allí antes o no. Sin embargo, evita llamar a los cargadores para inmutable rutas (como la lista) durante una navegación.

## Eliminar Registros
Si revisamos el código en la ruta de contacto, podemos encontrar que el botón Eliminar se ve así:
```
<Form
  method="post"
  action="destroy"
  onSubmit={(event) => {
    if (
      !confirm(
        "Please confirm you want to delete this record."
      )
    ) {
      event.preventDefault();
    }
  }}
>
  <button type="submit">Delete</button>
</Form>
```
> Nota el action puntos a "destroy". Como ```<Link to>, <Form action>``` puede tomar un relativo valor. Dado que el formulario se representa en contact/:contactId, entonces una acción relativa con destroy enviará el formulario a ```contact/:contactId/destroy``` cuando se hace clic.

En este punto, debe saber todo lo que necesita saber para que el botón Eliminar funcione. ¿Tal vez intentarlo antes de seguir adelante? 

Necesitarás: Una nueva ruta
An action en esa ruta
```
deleteContactde src/contacts.js
```
### 👉 Cree el módulo de ruta "destruir"
```
touch src/routes/destroy.jsx
````
### 👉 Añade la acción de destruir
```
import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
  await deleteContact(params.contactId);
  return redirect("/");
}
```
###👉 Agregue la ruta de destrucción a la configuración de ruta
```
/* existing code */
import { action as destroyAction } from "./routes/destroy";

const router = createBrowserRouter([
  {
    path: "/",
    /* existing root route props */
    children: [
      /* existing routes */
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
      },
    ],
  },
]);

/* existing code */
```
> Muy bien, navegue a un registro y haga clic en el botón "Eliminar". ¡Funciona!

### 😅 todavía estoy confundido por qué todo esto funciona

Cuando el usuario hace clic en el botón Enviar:

```<Form>``` evita el comportamiento predeterminado del navegador de enviar una nueva solicitud POST al servidor, pero emula el navegador creando una solicitud POST con enrutamiento del lado del cliente El ```<Form action="destroy">``` coincide con la nueva ruta en ```"contacts/:contactId/destroy"``` y le envía la solicitud después de que la acción redirige, React Router llama a todos los cargadores para los datos en la página para obtener los últimos valores (esto es "revalidación").

```useLoaderData``` ¡devuelve nuevos valores y hace que los componentes se actualicen!

> Agregue un formulario, agregue una acción, React Router hace el resto.

## Errores Contextuales
Solo para probar, arroje un error en la acción de destruir:
```
export async function action({ params }) {
  throw new Error("oh dang!");
  await deleteContact(params.contactId);
  return redirect("/");
}
```
¿Reconoces esa pantalla? Es nuestro errorElement de antes. El usuario, sin embargo, realmente no puede hacer nada para recuperarse de esta pantalla, excepto presionar actualizar.

### Creemos un mensaje de error contextual para la ruta de destrucción:
```
[
  /* other routes */
  {
    path: "contacts/:contactId/destroy",
    action: destroyAction,
    errorElement: <div>Oops! There was an error.</div>,
  },
];
```
Ahora inténtalo de nuevo:

Nuestro usuario ahora tiene más opciones que bloquear la actualización, puede continuar interactuando con las partes de la página que no tienen problemas 🙌

Porque la ruta de destrucción tiene la suya errorElement y es un hijo de la ruta raíz, el error se producirá allí en lugar de la raíz. Como probablemente haya notado, estos errores burbujean hasta el más cercano errorElement. Agregue tantos o tan pocos como desee, siempre y cuando tenga uno en la raíz.

## Rutas de Índice
Cuando carguemos la aplicación, notará una gran página en blanco en el lado derecho de nuestra lista.

Cuando una ruta tiene hijos, y usted está en el camino de la ruta de los padres, el ```<Outlet>``` no tiene nada que rendir porque ningún niño coincide. Puede pensar en las rutas de índice como la ruta secundaria predeterminada para completar ese espacio.

### 👉 Cree el módulo de ruta de índice
```
touch src/routes/index.jsx
```
### 👉 Rellene los elementos del componente de índice

> Siéntase libre de copiar pasta, nada especial aquí.
```
export default function Index() {
  return (
    <p id="zero-state">
      This is a demo for React Router.
      <br />
      Check out{" "}
      <a href="https://reactrouter.com">
        the docs at reactrouter.com
      </a>
      .
    </p>
  );
}
```
### 👉 Configure la ruta del índice
```
// existing code
import Index from "./routes/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index /> },
      /* existing routes */
    ],
  },
]);
```
> Nota el ```{ index:true }``` en lugar de ```{ path: "" }```. Eso le dice al enrutador que coincida y renderice esta ruta cuando el usuario está en la ruta exacta de la ruta principal, por lo que no hay otras rutas secundarias para renderizar en el ```<Outlet>```.

> ### No más espacio en blanco. Es común poner paneles, estadísticas, feeds, etc. en las rutas de índice. También pueden participar en la carga de datos.

### Cancelar Botón
En la página de edición tenemos un botón de cancelación que aún no hace nada. Nos gustaría que hiciera lo mismo que el botón de retroceso del navegador.

Necesitaremos un controlador de clics en el botón, así como ```useNavigate``` desde React Router.

### 👉 Agregue el controlador de clic del botón cancelar con useNavigate
```
import {
  Form,
  useLoaderData,
  redirect,
  useNavigate,
} from "react-router-dom";

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      {/* existing code */}

      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
```
Ahora, cuando el usuario haga clic en "Cancelar", se le devolverá una entrada en el historial del navegador.

### 🧐 ¿Por qué no hay ```event.preventDefault``` ¿ en el botón ?

A ```<button type="button">```, aunque aparentemente redundante, es la forma HTML de evitar que un botón envíe su formulario.

### Dos características más para llevar. ¡Estamos en el tramo de casa!

### URL Buscar Params y GET Envíos
Hasta ahora, toda nuestra interfaz de usuario interactiva ha sido enlaces que cambian la URL o formularios que publican datos en acciones. El campo de búsqueda es interesante porque es una mezcla de ambos: es un formulario pero solo cambia la URL, no cambia los datos.

En este momento es solo un HTML normal ```<form>```, no un enrutador React ```<Form>```. Veamos qué hace el navegador con él de forma predeterminada:

### 👉 Escriba un nombre en el campo de búsqueda y presione la tecla Intro

> Tenga en cuenta que la URL del navegador ahora contiene su consulta en la URL como URLSearchParams:
```
http://127.0.0.1:5173/?q=ryan
```
Si revisamos el formulario de búsqueda, se ve así:
```
<form id="search-form" role="search">
  <input
    id="q"
    aria-label="Search contacts"
    placeholder="Search"
    type="search"
    name="q"
  />
  <div id="search-spinner" aria-hidden hidden={true} />
  <div className="sr-only" aria-live="polite"></div>
</form>
```
Como hemos visto antes, los navegadores pueden serializar formularios por el name atributo de sus elementos de entrada. El nombre de esta entrada es ```q```, por eso la URL tiene ```?q=```. Si lo nombramos ```search``` la URL sería ```?search=```.

Tenga en cuenta que este formulario es diferente de los otros que hemos utilizado, no tiene ```<form method="post">```. El valor predeterminado method es ```"get"```. Eso significa que cuando el navegador crea la solicitud para el siguiente documento, no coloca los datos del formulario en el cuerpo POST de la solicitud, sino en el ```URLSearchParams``` de una solicitud ```GET```.

### OBTENga Envíos con Enrutamiento del Lado del Cliente.
Usemos el enrutamiento del lado del cliente para enviar este formulario y filtrar la lista en nuestro cargador existente.

### 👉 Cambiar ```<form> a <Form>```
```
<Form id="search-form" role="search">
  <input
    id="q"
    aria-label="Search contacts"
    placeholder="Search"
    type="search"
    name="q"
  />
  <div id="search-spinner" aria-hidden hidden={true} />
  <div className="sr-only" aria-live="polite"></div>
</Form>
```
### 👉 Filtre la lista si hay ```URLSearchParams```
```
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts };
}
```
Porque esto es un ```GET```, no un ```POST```, React Router no lo hace llama al action. Enviar un formulario ```GET``` es lo mismo que hacer clic en un enlace: solo cambia la URL. Es por eso que el código que agregamos para filtrar está en el loader, no el action de esta ruta.

Esto también significa que es una navegación de página normal. Puede hacer clic en el botón Atrás para volver a donde estaba.

### Sincronizar URLs con el Estado del formulario
Hay un par de problemas de UX aquí que podemos solucionar rápidamente.

Si hace clic después de una búsqueda, el campo de formulario todavía tiene el valor que ingresó aunque la lista ya no esté filtrada.

Si actualiza la página después de buscar, el campo de formulario ya no tiene el valor, aunque la lista esté filtrada

En otras palabras, la URL y nuestro estado de formulario están fuera de sincronización.

### 👉 Devolución de ```q``` desde su cargador y configúrelo como el valor predeterminado del campo de búsqueda
```
// existing code

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
            />
            {/* existing code */}
          </Form>
          {/* existing code */}
        </div>
        {/* existing code */}
      </div>
      {/* existing code */}
    </>
  );
}
```
Eso resuelve el problema (2). Si actualiza la página ahora, el campo de entrada mostrará la consulta.

Ahora para el problema (1), haga clic en el botón Atrás y actualice la entrada. Podemos traer ```useEffect``` de React para manipular el estado del formulario en el DOM directamente.

### 👉 Sincronizar el valor de entrada con la URL Search Params
```
import { useEffect } from "react";

// existing code

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  // existing code
}
```
### 🤔 ¿No deberías usar un componente controlado y React State para esto?

Ciertamente podría hacer esto como un componente controlado, pero terminará con más complejidad para el mismo comportamiento. No controlas la URL, el usuario lo hace con los botones atrás/adelante. Habría más puntos de sincronización con un componente controlado.

Si aún está preocupado, expanda esto para ver cómo se vería

### Envío de Formularios ```onChange```

Tenemos que tomar una decisión sobre el producto aquí. Para esta interfaz de usuario, probablemente preferiríamos que el filtrado ocurriera en cada golpe de clave en lugar de cuando el formulario se envía explícitamente.

### Hemos visto ```useNavigate``` ya usaremos a su primo, ```useSubmit```, para esto.
```
// existing code
import {
  // existing code
  useSubmit,
} from "react-router-dom";

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                submit(event.currentTarget.form);
              }}
            />
            {/* existing code */}
          </Form>
          {/* existing code */}
        </div>
        {/* existing code */}
      </div>
      {/* existing code */}
    </>
  );
}
```
> ### ¡Ahora, a medida que escribe, el formulario se envía automáticamente!

Tenga en cuenta el argumento para `submit`. Estamos de paso event.currentTarget.form. El currentTarget es el nodo DOM al que se adjunta el evento, y el currentTarget.form es el nodo de formulario principal de la entrada. El `submit` la función serializará y enviará cualquier formulario que le pase.

### Agregar Búsqueda Spinner
En una aplicación de producción, es probable que esta búsqueda busque registros en una base de datos que sea demasiado grande para enviarlos de una vez y filtrar el lado del cliente. Es por eso que esta demostración tiene una latencia de red falsa.

Sin ningún indicador de carga, la búsqueda se siente un poco lenta. Incluso si pudiéramos hacer que nuestra base de datos sea más rápida, siempre tendremos la latencia de red del usuario en el camino y fuera de nuestro control. Para un mejor UX, agreguemos algunos comentarios inmediatos de UI para la búsqueda. Para esto lo usaremos useNavigation de nuevo.

### 👉 Añade el spinner de búsqueda
```
// existing code

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              // existing code
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            {/* existing code */}
          </Form>
          {/* existing code */}
        </div>
        {/* existing code */}
      </div>
      {/* existing code */}
    </>
  );
}
```
El navigation.location aparecerá cuando la aplicación esté navegando a una nueva URL y cargando los datos para ella. Luego desaparece cuando ya no hay navegación pendiente.

### Gestionar la Pila de Historia
Ahora que el formulario se envía para cada trazo de tecla, si escribimos los caracteres "seba" y luego los eliminamos con retroceso, terminamos con 7 nuevas entradas en la pila 😂. Definitivamente no queremos esto.

Podemos evitar esto por sustitución la entrada actual en la pila de historial con la página siguiente, en lugar de empujarla.

### 👉 Usar replace en submit
```
// existing code

export default function Root() {
  // existing code

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              // existing code
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            {/* existing code */}
          </Form>
          {/* existing code */}
        </div>
        {/* existing code */}
      </div>
      {/* existing code */}
    </>
  );
}
```
Solo queremos reemplazar los resultados de búsqueda, no la página antes de comenzar a buscar, por lo que hacemos una verificación rápida si esta es la primera búsqueda o no y luego decidimos reemplazarla.

Cada trazo de tecla ya no crea nuevas entradas, por lo que el usuario puede hacer clic en los resultados de búsqueda sin tener que hacer clic en 7 veces 😅.

### Mutaciones Sin Navegación
Hasta ahora, todas nuestras mutaciones (las veces que cambiamos los datos) han utilizado formularios que navegan, creando nuevas entradas en la pila de historial. Si bien estos flujos de usuarios son comunes, es igualmente común querer cambiar los datos sin causando una navegación.

Para estos casos, tenemos el useFetcher gancho. Nos permite comunicarnos con cargadores y acciones sin provocar una navegación.

El botón ★ en la página de contacto tiene sentido para esto. No estamos creando o eliminando un nuevo registro, no queremos cambiar de página, simplemente queremos cambiar los datos de la página que estamos viendo.

### 👉 Cambiar el <Favorite> forma a un formulario de búsqueda
```
import {
  useLoaderData,
  Form,
  useFetcher,
} from "react-router-dom";

// existing code

function Favorite({ contact }) {
  const fetcher = useFetcher();
  const favorite = contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
```
Podría querer echar un vistazo a esa forma mientras estamos aquí. Como siempre, nuestro formulario tiene campos con un `name prop`. Este formulario enviará formData con un favorite la llave es tampoco `"true" | "false"`. Como tiene `method="post"` llamará a la acción. Como no hay `<fetcher.Form action="...">` `prop`, se publicará en la ruta donde se representa el formulario.

### 👉 Crea la acción
```
// existing code
import { getContact, updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  // existing code
}
```
Bastante simple. Extraiga los datos del formulario de la solicitud y envíelos al modelo de datos.

### 👉 Configure la nueva acción de la ruta
```
// existing code
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index /> },
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      /* existing code */
    ],
  },
]);
```
¡Muy bien, estamos listos para hacer clic en la estrella al lado del nombre del usuario!

Mira eso, ambas estrellas se actualizan automáticamente. Nuestro nuevo `<fetcher.Form method="post">` funciona casi exactamente como el `<Form>` hemos estado usando: llama a la acción y luego todos los datos se revalidan automáticamente, incluso sus errores se detectarán de la misma manera.

Sin embargo, hay una diferencia clave, no es una navegación: la URL no cambia, la pila de historial no se ve afectada.

## UI Optimista
Probablemente notó que la aplicación no respondía cuando hicimos clic en el botón favorito de la última sección. ¡Una vez más, agregamos algo de latencia de red porque la tendrás en el mundo real!

Para dar al usuario algunos comentarios, podríamos poner la estrella en un estado de carga con fetcher.state (muy parecido navigation.state desde antes), pero podemos hacer algo aún mejor esta vez. Podemos usar una estrategia llamada "UI optimista"

El buscador conoce los datos del formulario que se envían a la acción, por lo que está disponible para usted en fetcher.formData. Lo usaremos para actualizar inmediatamente el estado de la estrella, a pesar de que la red no ha terminado. Si la actualización finalmente falla, la interfaz de usuario volverá a los datos reales.

### 👉 Lea el valor optimista de `fetcher.formData`
```
// existing code

function Favorite({ contact }) {
  const fetcher = useFetcher();

  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
```
Si hace clic en el botón ahora debería ver la estrella inmediatamente cambio al nuevo estado. En lugar de representar siempre los datos reales, verificamos si el buscador tiene alguno formData al ser enviado, si es así, lo usaremos en su lugar. Cuando la acción se hace, el fetcher.formData ya no existirá y volvemos a usar los datos reales. Entonces, incluso si escribe errores en su código de UI optimista, eventualmente volverá al estado correcto 🥹

### Datos No Encontrados
¿Qué sucede si el contacto que estamos tratando de cargar no existe?

Nuestra raíz errorElement está atrapando este error inesperado mientras tratamos de representar un null contacto. ¡Bien, el error se manejó correctamente, pero podemos hacerlo mejor!

Siempre que tenga un caso de error esperado en un cargador o action, como los datos que no existen, puede throw. La pila de llamadas se romperá, React Router lo atrapará y la ruta de error se representará en su lugar. Ni siquiera intentaremos renderizar un null contacto.

### 👉 Lanza una respuesta 404 en el cargador
```
export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}
```
En lugar de golpear un error de renderizado con Cannot read properties of null, evitamos el componente por completo y renderizamos la ruta de error, diciéndole al usuario algo más específico.

Esto mantiene tus caminos felices, felices. Los elementos de su ruta no necesitan preocuparse por los estados de error y carga.

### Rutas Sin Camino
Una última cosa. La última página de error que vimos sería mejor si se renderizara dentro de la salida raíz, en lugar de toda la página. De hecho, cada error en todas nuestras rutas secundarias sería mejor en la salida, entonces el usuario tiene más opciones que presionar actualizar.

Nos gustaría que se viera así:

Podríamos agregar el elemento de error a cada una de las rutas secundarias, pero, dado que es la misma página de error, esto no se recomienda.

Hay una manera más limpia. Se pueden usar rutas sin una ruta, que les permite participar en el diseño de la interfaz de usuario sin requerir nuevos segmentos de ruta en la URL. Compruébalo:

### 👉 Envuelva las rutas de los niños en una ruta sin camino
```
createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          /* the rest of the routes */
        ],
      },
    ],
  },
]);
```
¡Cuando se arrojan errores en las rutas infantiles, nuestra nueva ruta sin camino lo atrapará y renderizará, preservando la interfaz de usuario de la ruta raíz!

## JSX Rutas
Y para nuestro truco final, muchas personas prefieren configurar sus rutas con JSX. Puedes hacerlo con createRoutesFromElements. No hay diferencia funcional entre JSX u objetos al configurar sus rutas, es simplemente una preferencia estilística.
```
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route
          path="contacts/:contactId"
          element={<Contact />}
          loader={contactLoader}
          action={contactAction}
        />
        <Route
          path="contacts/:contactId/edit"
          element={<EditContact />}
          loader={contactLoader}
          action={editAction}
        />
        <Route
          path="contacts/:contactId/destroy"
          action={destroyAction}
        />
      </Route>
    </Route>
  )
);
```
¡Eso es todo! Gracias por darle una oportunidad a React Router. Esperamos que este tutorial le dé un comienzo sólido para crear excelentes experiencias de usuario. Hay mucho más que puede hacer con React Router, así que asegúrese de consultar todas las API 😀