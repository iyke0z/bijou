<template>
    <div>
        <h4>Customer Management</h4>
        <article>
            <div class="ml-4">
                <li class="lead">How Do I Create Customers?</li>
                <p> (A). To create a new customer, go to the <router-link  to="/customer/create">Create Customer</router-link> Page
                     <br> (B). Fill out the fields and submit.
                </p>

                <li class="lead">How Do I Update Customers?</li>
                <p>
                    (A). To update a customer, go to the <router-link  to="/customer/all">Customers</router-link> Page <br>
                    (B). Search for the customer you want to update, on the actions column, click on the <i class="fa fa-edit text-info"></i> icon.
                </p>

                <li class="lead">How Do I Fund Customers Wallet?</li>
                <p>
                    (A). To update a customer, go to the <router-link  to="/customer/all">Customers</router-link> Page <br>
                    (B). Search for the customer you want to fund, on the actions column, click on the <i class="fa fa-money text-dark"></i> icon.
                </p>


                <li class="lead">How Do I View Customers Transaction History?</li>
                <p>
                    (A). To view a customers transaction history, go to the <router-link  to="/customer/all">Customers</router-link> Page <br>
                    (B). Search for the customer you want to view transaction history for, on the actions column, click on the <i class="fa fa-eye text-warning"></i> icon.
                </p>

                <li class="lead">How Do I Delete Customers?</li>
                <p>
                    (A). To delete a customers, go to the <router-link  to="/customer/all">Customers</router-link> Page <br>
                    (B). Search for the customer you want to delete, on the actions column, click on the <i class="fa fa-trash text-danger"></i> icon.
                </p>
            </div>

        </article>
    </div>
</template>
<script>
export default{

}
</script>