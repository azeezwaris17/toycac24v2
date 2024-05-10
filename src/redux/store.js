// store.js
import { configureStore } from "@reduxjs/toolkit";
import userRegistrationAuthReducer from "./user/userRegistrationAuthSlice";
import userSigninAuthReducer from "./user/userSigninAuthSlice";
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

export default configureStore({
  reducer: {
    userRegistrationAuth: userRegistrationAuthReducer,
    userSigninAuth: userSigninAuthReducer,

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
  },
});
