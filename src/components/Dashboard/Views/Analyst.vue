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
  <script>
    import axios from 'axios';

    export default{
      data(){
        return{
            loading: false,
            details:null,
            packages:null,
            business:null,
            prompt:null,
            responses: [],
            dataset: null
        }
      },
      methods: {
  
        promptAI(){
          this.loading = true
          axios.post('https://api.openai.com/v1/chat/completions', {
              model: 'gpt-4o-mini',
              messages: [
                  { 
                      role: 'system', 
                      content: 'You are a business analyst. Your responsibilities include analyzing expenditure, revenue, profit and loss accounts. You also provide forecasts and strategic business advice to enhance profitability and drive business growth.' 
                  },
                  { role: 'user', content: this.prompt+' based on this availabe set of data '+ this.dataset }
              ],
              temperature: 0.7
            }, 
            {
              headers: {
                  Authorization: 'Bearer ' + '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'
              }
            }).then(res => {
              console.log(res)
            })
        },

        getProducts(){

        },

        getExpenditure(){

        },

        getPandL(){

        },

        getPayableAccounts(){
          
        }
    }
  }
  </script>
  