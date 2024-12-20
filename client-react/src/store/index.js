import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import authReducer from "../state";

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST, 
                    PURGE,
                    REGISTER
                ]
            }
        })
});

export default store;