// import { redirect } from "react-router-dom";
// import { getContact, getContacts, createContact, updateContact } from "../contacts";


// export async function action() {
//   const contact = await createContact();
//   return redirect(`/contacts/${contact.id}/edit`);
// }

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const q = url.searchParams.get("q");
//   const contacts = await getContacts(q);
//   return { contacts, q };
// }

// export async function loaderContac({ params }) {
//   const contact = await getContact(params.contactId);
//   if (!contact) {
//     throw new Response("", {
//       status: 404,
//       statusText: "Not Found",
//     });
//   }
//   return { contact };
// }

// export async function actionEdit({ request, params }) {
//   const formData = await request.formData();
//   const updates = Object.fromEntries(formData);
//   await updateContact(params.contactId, updates);
//   return redirect(`/contacts/${params.contactId}`);
// }

// export async function actionContac({ request, params }) {
//   const formData = await request.formData();
//   return updateContact(params.contactId, {
//     favorite: formData.get("favorite") === "true",
//   });
// }

import { redirect } from "react-router-dom";
import { getContact, getContacts, createContact, updateContact } from "../contacts";

// Crea un nuevo contacto y redirige a la vista de edición
export async function action() {
  try {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
  } catch (error) {
    console.error("Error creating contact:", error);
    throw new Response("Error creating contact", { status: 500 });
  }
}

// Carga la lista de contactos con un filtro opcional basado en la búsqueda (query)
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || ""; // Aseguramos que 'q' nunca sea null
  try {
    const contacts = await getContacts(q);
    return { contacts, q };
  } catch (error) {
    console.error("Error loading contacts:", error);
    throw new Response("Error loading contacts", { status: 500 });
  }
}

// Carga un contacto específico basado en su ID
export async function loaderContac({ params }) {
  try {
    const contact = await getContact(params.contactId);
    if (!contact) {
      throw new Response("Contact not found", { status: 404, statusText: "Not Found" });
    }
    return { contact };
  } catch (error) {
    console.error(`Error loading contact ${params.contactId}:`, error);
    throw new Response("Error loading contact", { status: 500 });
  }
}

// Acción para editar un contacto, actualiza los campos recibidos
export async function actionEdit({ request, params }) {
  try {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
  } catch (error) {
    console.error(`Error updating contact ${params.contactId}:`, error);
    throw new Response("Error updating contact", { status: 500 });
  }
}

// Acción para marcar o desmarcar un contacto como favorito
export async function actionContac({ request, params }) {
  try {
    const formData = await request.formData();
    const favorite = formData.get("favorite") === "true";
    await updateContact(params.contactId, { favorite });
    return null; // No es necesario redirigir
  } catch (error) {
    console.error(`Error updating favorite for contact ${params.contactId}:`, error);
    throw new Response("Error updating favorite", { status: 500 });
  }
}
