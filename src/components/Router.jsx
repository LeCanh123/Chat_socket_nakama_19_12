import { createBrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./Register";
import App from "../App";
import Login from "./Login";
import CreateGroup from "./Groups/CreateGroup";
import Mygroup from "./Groups/Mygroup";
import Groupinfo from "./Groups/Groupinfo";
import AddToGroup from "./Groups/AddToGroup";
import Addfriend from "./Friends/Addfriend";
import Listfriend from "./Friends/Listfriend";
import Chatwithfriend from "./Friends/Chatwithfriend";



const router = createBrowserRouter([
    {
      path: "/",
      element: 
       <App></App>
      ,
    },
    {
      path: "register",
      element: <Register></Register>
    },
    {
      path: "login",
      element: <Login></Login>
    },
    {
      path: "creategroup",
      element: <CreateGroup></CreateGroup>
    },
    {
      path: "mygroup",
      element: <Mygroup></Mygroup>
    },
    {
      path: "groupinfo/:id",
      element: <Groupinfo></Groupinfo>
    },
    {
      path: "addtogroup",
      element: <AddToGroup></AddToGroup>
    },
    {
      path: "addfriend",
      element: <Addfriend></Addfriend>
    },
    {
      path: "listfriend",
      element: <Listfriend />
    },
    {
      path: "listfriend/:id",
      element: <Chatwithfriend />
    },



  ]);


  export default router