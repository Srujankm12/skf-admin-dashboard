let url ="https://skfplc.vsensetech.in"

//admin
export let createadmin = url + "/root/create/admin"
export let adminlogin = url + "/login/admin"
export let deleteadmin = url + "/root/delete/admin/__ADMIN_ID__"

//user
export let createuser = url + "/admin/create/user"
export let deleteuser = url + "/admin/delete/user/__USER_ID__"
export let getusers = url + "/admin/users"

//plc
export let createplc = url + "/admin/create/plc/__USER_ID__"
export let deleteplc = url + "/admin/delete/plc/__PLC_ID__"
export let getplc = url + "/admin/plcs/__USER_ID__"
//drier
export let createdrier = url + "/admin/create/drier/__PLC_ID__"
export let deletedrier = url + "/admin/delete/drier/__PLC_ID__/__DRIER_ID__"
export let getdriers = url + "/admin/driers/__PLC_ID__"

//register
export let createregister = url + "/admin/create/register/__PLC_ID__/__DRIER_ID__"
export let deleteregister = url + "/admin/delete/register/__PLC_ID__/__DRIER_ID__/__REG_ADDRESS__/__REG_TYPE__"
export let getregisters = url + "/admin/registers/__PLC_ID__/__DRIER_ID__"
export let createregistertype = url + "/admin/create/register_type"
export let deleteregistertype = url + "/admin/delete/register_type/__REGISTER_TYPE__"

//giveaccess
export let giveaccesstouser = url + "/admin/give/user/access"

export let getregistertypesforform = url + "/admin/register/types/__PLC_ID__/__DRIER_ID__"

