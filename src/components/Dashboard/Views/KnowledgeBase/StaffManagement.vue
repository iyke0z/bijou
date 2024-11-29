<template>
    <div>
        <h4>User Management</h4>
        <article>
            <div class="ml-4">
                <li class="lead">How Do I Create users?</li>
                <p> (A). To create a new user, go to the <router-link  to="/user/create">Add New User</router-link> Page
                     <br> (B). Fill out the fields and submit. <small>note that the roles vary, sales and cashier roles will not have administrative access</small>
                </p>

                <li class="lead">How Do I Update users?</li>
                <p>
                    (A). To update a user, go to the <router-link  to="/user/all">Users</router-link> Page <br>
                    (B). Search for the user you want to update, on the actions column, click on the <i class="fa fa-edit text-info"></i> icon.
                </p>

                <li class="lead">How Do I Generate users Sales Code?</li>
                <p>
                    (A). To generate a user code, go to the <router-link  to="/user/all">Users</router-link> Page <br>
                    (B). Search for the user you want to assign a sales code, on the actions column, click on the <i class="fa fa-user text-primary"></i> icon.
                </p>

                <li class="lead">How Do I View users Activity History?</li>
                <p>
                    (A). To view a user transaction history, go to the <router-link  to="/user/all">Users</router-link> Page <br>
                    (B). Search for the user you want to see activity history, on the actions column, click on the <i class="fa fa-eye text-warning"></i> icon.
                </p>

                <li class="lead">How Do I Delete users?</li>
                <p>
                    (A). To delete a user, go to the <router-link  to="/user/all">Customers</router-link> Page <br>
                    (B). Search for the user you want to delete, on the actions column, click on the <i class="fa fa-trash text-danger"></i> icon.
                </p>
            </div>

        </article>
    </div>
</template>
<script>
export default{

}
</script>