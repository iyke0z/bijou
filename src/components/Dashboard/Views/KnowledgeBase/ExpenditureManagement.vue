<template>
    <div>
        <h4>Expenditure Management</h4>
        <article>
            <div class="ml-4">
                <li class="lead">How Do I Create Expenditures?</li>
                <p>
                    (A). To create an expenditure first ensure you have created the different types of ependitures your business use
                    , to do that, go to the <router-link  to="/expenditure/type">New Expenditure Type</router-link> Page <br>
                    (B). Select the expenditure category (OPEX or COGS). Click on SUMBIT.<br>
                    (C). Go to the <router-link to="/expenditure/create">New Expenditure</router-link> Page <br>
                    (D). Select the expenditure type you created in step A and B, input the Amount spent, Click on SUMBIT.
                </p>

                <li class="lead">How Do I View Expenditure Report?</li>
                <p>
                    (A). To view expenditure report, go to the <router-link  to="/expenditure/all">All Expenditure</router-link> Page <br>
                    (B). Input the date range of your choice and click on filter <i class="fa fa-user text-primary"></i> icon.
                </p>
            </div>

        </article>
    </div>
</template>
<script>
export default{

}
</script>