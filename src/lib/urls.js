let url ="https://skfplc.http.vsensetech.in"

//admin
export let createadmin = url + "/root/create/admin"
export let adminlogin = url + "/login/admin"
export let deleteadmin = url + "/root/delete/admin/__ADMIN_ID__"

//user
export let createuser = url + "/admin/create/user"
export let deleteuser = url + "/admin/delete/user/"
export let getusers = url + "/admin/users"

//plc
export let createplc = url + "/admin/create/plc/"
export let deleteplc = url + "/admin/delete/plc/"
export let getplc = url + "/admin/plcs/"
//drier
export let createdrier = url + "/admin/create/drier/"
export let deletedrier = url + "/admin/delete/drier/"
export let getdriers = url + "/admin/driers/"

//register
export let createregister = url + "/admin/create/register"
export let deleteregister = url + "/admin/delete/register/__PLC_ID__/__DRIER_ID__/__REG_ADDRESS__/__REG_TYPE__"
export let getregisters = url + "/admin/registers/"
export let createregistertype = url + "/admin/create/"
export let deleteregistertype = url + "/admin/delete/register_type/__REGISTER_TYPE__"

//giveaccess
export let giveaccesstouser = url + "/admin/give/user/access"

export let getregistertypesforform = url + "/admin/register/types/"

export let getrecipestepcount = url +"/user/recipe/step/count/"

 