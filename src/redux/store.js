// store.js
import { configureStore } from "@reduxjs/toolkit";
import userRegistrationAuthReducer from "./user/userRegistrationAuthSlice";
import userSigninAuthReducer from "./user/userSigninAuthSlice";
import userCreateAccountAuthReducer from "./user/UserCreateAccount"
import userResetPasswordReducer from "./user/userResetPassword";



import superAdminRegistrationAuthReducer from "./super_admin/superAdminRegistrationAuthSlice";
import superAdminSigninAuthReducer from "./super_admin/superAdminSigninAuthSlice";
import adminRegistrationAuthReducer from "./admin/adminRegistrationAuthSlice";
import adminSigninAuthReducer from "./admin/adminSigninAuthSlice";
import adminFetchAllUsersReducer from "./admin/adminFetchAllUsers";
import adminApproveUserReducer from "./admin/adminApproveUserAccount";
import superAdminFetchAllUsersReducer from "./super_admin/superAdminFetchAllUsers";
import superAdminApproveUserReducer from "./super_admin/superAdminApproveUserAccount";

import superAdminFetchAllAdminsReducer from "./super_admin/superAdminFetchAllAdmins";
import superAdminApproveAdminReducer from "./super_admin/superAdminApproveAdminAccount";

import superAdminFetchAllRolesReducer from "./super_admin/superAdminFetchAllRoles";
import superAdminAssignRoleReducer from "./super_admin/superAdminAssignRole";
import superAdminRevokeRoleReducer from "./super_admin/superAdminRevokeRole";
import superAdminNotificationReducer from "./super_admin/notifications"



export default configureStore({
  reducer: {
    // name of slice: name of reducer
    userRegistrationAuth: userRegistrationAuthReducer,
    userSigninAuth: userSigninAuthReducer,
    userCreateAccountAuth: userCreateAccountAuthReducer,
    userResetPassword: userResetPasswordReducer,

    adminRegistrationAuth: adminRegistrationAuthReducer,
    adminSigninAuth: adminSigninAuthReducer,

    adminFetchAllUsers: adminFetchAllUsersReducer,
    adminApproveUser: adminApproveUserReducer,

    superAdminRegistrationAuth: superAdminRegistrationAuthReducer,
    superAdminSigninAuth: superAdminSigninAuthReducer,

    superAdminFetchAllUsers: superAdminFetchAllUsersReducer,
    superAdminApproveUser: superAdminApproveUserReducer,

    superAdminFetchAllAdmins: superAdminFetchAllAdminsReducer,
    superAdminApproveAdmin: superAdminApproveAdminReducer,

    superAdminFetchAllRoles: superAdminFetchAllRolesReducer,
    superAdminAssignRole: superAdminAssignRoleReducer,
    superAdminRevokeRole: superAdminRevokeRoleReducer,
    superAdminNotifications: superAdminNotificationReducer
  },
});
