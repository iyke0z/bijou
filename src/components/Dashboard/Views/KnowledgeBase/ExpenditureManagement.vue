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

                <li class="lead">How Do I Update Expenditure To Affect Cashflow?</li>
                <p>
                    (A). For expenditures first view the expenditure report, go to the <router-link  to="/expenditure/all">All Expenditure</router-link> Page <br>
                    (B). Click on <i class="fa fa-wrench text-primary"></i> icon.<br>
                    (C). On the pop up, select the conditions for payment on that commodity and update, after that the cashflow balane will be updated.<br>
                    (D). For Direct product purchases first view the expenditure report, go to the <router-link  to="/purchase/all">Purchases</router-link> Page <br>
                    (E). Click on <i class="fa fa-search text-primary"></i> icon. <br>
                    (F). On the details section which shows below up, Click on <i class="fa fa-wrench text-primary"></i> icon.<br>
                    (G). On the pop up, select the conditions for payment on that commodity and update, after that the cashflow balane will be updated.<br>

                </p>
            </div>

        </article>
    </div>
</template>
<script>
export default{

}
</script>