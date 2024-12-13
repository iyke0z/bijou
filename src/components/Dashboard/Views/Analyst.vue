<template>
  <div><br>
      <h4>Business Analyst</h4>
      <div class="row">
        <!-- <div class="md-3"> -->
          <div class="row">

</div>

    </div>
      <!-- </div> -->
      <section class="col-12 col-md-6">
        <form @submit.prevent="promptAI">
          <div class="form-group">
            <!-- <label for="activationCode">Activation Code</label> -->
            <textarea type="text"  v-model="prompt" class="form-control" placeholder="What do you want to know about your business?" required> </textarea>
          </div>
          <button class="btn btn-success col-12 col-md-8" type="submit">
            submit <span class="loader" v-if="loading"></span>
          </button>
        </form>
      </section>
     
    </div>
  </template>
 <script></script>