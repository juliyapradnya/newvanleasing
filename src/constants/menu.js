import { adminRoot } from "./config";
import { UserRole } from "../utils/auth.roles";

const data = [{
  id: "dashboard",
  icon: "iconsminds-optimization",
  label: "menu.dashboard",
  to: `${adminRoot}/dashboard`,
},
{
  id: "vehicles",
  icon: "iconsminds-jeep",
  label: "menu.vehicles",
  to: `${adminRoot}/vehicles`,
  subs: [{
    icon: "iconsminds-jeep",
    label: "menu.all-vehicles",
    to: `${adminRoot}/vehicles/all-vehicles`
  }, {
    icon: "iconsminds-check",
    label: "menu.available-stock",
    to: `${adminRoot}/vehicles/available-stock`
  }]
  },
{
  id: "contracts",
  icon: "iconsminds-box-with-folders",
  label: "menu.contracts",
  to: `${adminRoot}/contracts`,
  subs: [{
    icon: "iconsminds-box-full",
    label: "menu.all-contracts",
    to: `${adminRoot}/contracts/all-contracts`
  }, {
    icon: "iconsminds-timer",
    label: "menu.active-contracts",
    to: `${adminRoot}/contracts/active-contracts`
  }]
},
{
  id: "end-contracts",
  icon: "iconsminds-sand-watch-2",
  label: "menu.end-contracts",
  to: `${adminRoot}/end-contracts`
},
// {
//   id: "single",
//   icon: "iconsminds-three-arrow-fork",
//   label: "menu.single",
//   to: `${adminRoot}/single`,
// },
// {
//   id: "docs",
//   icon: "iconsminds-library",
//   label: "menu.docs",
//   to: "https://piaf-vue-docs.coloredstrategies.com/",
//   newWindow: true
// }
];
export default data;
