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

export default configureStore({
  reducer: {
    userRegistrationAuth: userRegistrationAuthReducer,
    userSigninAuth: userSigninAuthReducer,
    superAdminRegistrationAuth: superAdminRegistrationAuthReducer,
    superAdminSigninAuth: superAdminSigninAuthReducer,
    adminRegistrationAuth: adminRegistrationAuthReducer,
    adminSigninAuth: adminSigninAuthReducer,
    adminFetchAllUsers: adminFetchAllUsersReducer,
    adminApproveUser: adminApproveUserReducer,
    superAdminFetchAllUsers: superAdminFetchAllUsersReducer,
    superAdminApproveUser: superAdminApproveUserReducer,
    superAdminFetchAllAdmins: superAdminFetchAllAdminsReducer,
    superAdminApproveAdmin: superAdminApproveAdminReducer,
  },
});
