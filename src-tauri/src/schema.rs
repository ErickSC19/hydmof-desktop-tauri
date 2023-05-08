// @generated automatically by Diesel CLI.

diesel::table! {
    admins (admin_id) {
        admin_id -> Nullable<Integer>,
        username -> Text,
        pass -> Text,
        email -> Text,
        token -> Nullable<Text>,
        confirmed -> Bool,
    }
}

diesel::table! {
    years (year_id) {
        year_id -> Nullable<Integer>,
        from_date -> Timestamp,
        to_date -> Timestamp,
        complete -> Bool,
        months -> Integer,
        employees -> Integer,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        admin_id -> Integer,
    }
}

diesel::joinable!(years -> admins (admin_id));

diesel::allow_tables_to_appear_in_same_query!(
    admins,
    years,
);
