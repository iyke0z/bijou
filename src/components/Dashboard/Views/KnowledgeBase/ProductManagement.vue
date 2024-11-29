<template>
    <div>
        <h4>Product Management</h4>
        <article>
            <div class="ml-4">
                <li class="lead">How Do I Create Categories?</li>
                <p>(A). To create categories, go to the <router-link  to="/category/all">Categories</router-link> Page
                     <br> (B). Click on the Add new button at the top of the table.
                     <br> (C). Once the modal pops up, input the name and select is this category of products has stocks or not. <br>
                     <small>Note that if a category has stocks (yes), during sales the system will work with the inventory</small>.
                     <br> (D). Multiple categories can be created by clicking on the <i class="fa fa-plus text-info"></i> icon on the right.
                     <br> (E). Once the categories have been added, click on the SUBMIT button. <br>

                </p>

                <li class="lead">How Do I View All Categories?</li>
                <p>(A). To view all categories, go to the <router-link  to="/category/all">Categories</router-link> Page</p>

                <li class="lead">How Do I Delete Category?</li>
                <p>(A). To delete a categories, go to the <router-link  to="/category/all">Categories</router-link> Page
                    <br>(B). On the category you want to delete, click on the <i class="fa fa-trash text-danger"></i> icon in the actions column of the table</p>

                <li class="lead">How Do I Create Products? </li>
                <p>
                    (A). To create products, go to the <router-link  to="/product/create">Add New Product</router-link> Page <br>
                    (B). Fill out the fields, note that code, is optional. Click on SUBMIT button once you're done
                    <br> (C). Multiple categories can be created by clicking on the plus button on the right.
                </p>

                <li class="lead">How Do I View All Products?</li>
                <p>(A). To view products, go to the <router-link  to="/product/all">Products</router-link> Page <br></p>

                <li class="lead">How Do I View Products Details & Report?</li>
                <p>
                    (A). To view product report, go to the <router-link  to="/product/all">Products</router-link> Page
                    <br> (B). Search for the product you want to view the details, on the actions column, click on the <i class="fa fa-eye text-warning"></i> icon.
                </p>

                <li class="lead">How Do I Update Products?</li>
                <p>
                (A). To update product, go to the <router-link  to="/product/all">Products</router-link> Page
                    <br> (B). Search for the product you want to update, on the actions column, click on the <i class="fa fa-edit text-info"></i> icon.
                </p>

                <li class="lead">How Do I Delete Products?</li>
                <p>
                         (A). To delete a product, go to the <router-link  to="/product/all">Products</router-link> Page
                    <br> (B). Search for the product you want to delete, on the actions column, click on the <i class="fa fa-trash text-danger"></i> icon.
                </p>
                                

            </div>

        </article>
    </div>
</template>
<script>
export default{

}
</script>