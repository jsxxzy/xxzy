import newHome from "@/components/newPages/Home/Home";
import HomeBar from "@/components/newPages/Home/HomeBar";
import newTable from "@/components/newPages/Home/newTable";
import newPerson from "@/components/newPages/Home/newPerson";
import newMsg from "@/components/newPages/Home/newMsg";
import nod from "@/components/newPages/nodata";
const newIndexRoute = [
  {
    path: "/new/HomeBar",
    name: "HomeBar",
    component: HomeBar,
    redirect: "/new/Home",
    children: [
      {
        path: "/new/Home",
        name: "newHome",
        component: newHome
      },
      {
        path: "/new/Table",
        name: "newTable",
        component: newTable
      },
      {
        path: "/new/Person",
        name: "newPerson",
        component: newPerson
      },
      {
        path: "/new/Msg",
        name: "newMsg",
        component: newMsg
      }
    ]
  },
  {
    path: "/nod",
    name: "nod",
    component: nod,
  }
];
export default newIndexRoute;



// WEBPACK FOOTER //
// ./src/router/newIndex.js