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
