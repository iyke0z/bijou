<template>
    <div>
        <h4>Sales Point Management</h4>
        <article>
            <div class="ml-4">
                <li class="lead">How Do I Record My Sales?</li>
                <p>(A). The record sales go to the <router-link  to="/sales-point">Sales Point</router-link> Page
                     <br> (B). Search for the product your want to record by input the name of the product in the search bar on the top of the screen.
                     <br> (C). Click on the desired product and it appends to the table.
                     <br> (D). To update the price, if there's a need, on the price column input your desired price.
                     <br> (E). Select the payment method and pay.
                </p>

                <li class="lead">How Do I Record Credit Sales?</li>
                <p>(A). Once the product has been selected, search for the customer you want to sell to on credit <small>
                    (Note that this must be sold to a known customer, read customer management FAQ if you haven't).</small>.
                    <br> (B). Select the customer, and click on the checkbox which is either "wallet" or "credit". If the customer has available funds in his wallet, select wallet else if its on credit, select credit

                 <br></p>

                <li class="lead">How Do I Sell to a Known Customer?</li>
                <p>(A). The record sales go to the <router-link  to="/sales-point">Sales Point</router-link> Page
                     <br> (B). Search for the product your want to record by input the name of the product in the search bar on the top of the screen.
                     <br> (C). Click on the desired product and it appends to the table.
                     <br> (D). To update the price, if there's a need, on the price column input your desired price.
                     <br> (E). Select the customer, If the customer has available funds in his wallet, select wallet else if its on credit, select credit
                     <br> (F). If the customer is paying immediately, Select the payment method and pay.
                </p>

                <li class="lead">How Do I Void a Sale?</li>
                <p>(A). This is highly discouraged, however to void sale, go to the <router-link  to="/report/general">Periodic Report</router-link> Page
                     <br> (B). Input the date using the date range filter.
                     <br> (C). On the details table, look for the reference of that sale matching it with the REF NO column
                     <br> (D). To view the details of that sale for clarity, click on the <i class="fa fa-eye text-info"></i> icon
                     <br> (E). Once confirmed, click on the <i class="fa fa-trash text-danger"></i> icon
                </p>
            </div>

        </article>
    </div>
</template>
<script>
export default{

}
</script>