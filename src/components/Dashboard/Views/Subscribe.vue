<template>
  <div>
    <br />
    <h4>Billing</h4>
    <div class="row">
      <div class="row col-12">
        <!-- Loader -->
        <div class="loader" v-if="loading"></div>

        <!-- Toggle Between Monthly and Annual -->
        <div class="col-12 mb-4">
          <button
            class="btn btn-outline-dark"
            :class="{ active: selectedPackageType === 'freebies' }"
            @click="switchPackageType('freebies')"
          >
            Free Trial Packages
          </button>
          <button
            class="btn btn-outline-dark"
            :class="{ active: selectedPackageType === 'monthly' }"
            @click="switchPackageType('monthly')"
          >
            Monthly Packages
          </button>
          <button
            class="btn btn-outline-secondary"
            :class="{ active: selectedPackageType === 'annually' }"
            @click="switchPackageType('annually')"
          >
            Annual Packages
          </button>
        </div>

        <!-- Packages Display -->
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
          v-for="single_package in displayedPackages"
          :key="single_package.id"
        >
          <div class="card card-stats">
            <div class="card-header lead">
              <center>
                <h5 class="text-muted">{{ single_package.name }}</h5><br />
                <p class="text-sm">
                  <small>
                    <span
                    v-for="(desc, index) in single_package.description.split(',')"
                    :key="index"
                  >
                    {{ desc.trim() }}
                    <br v-if="index < single_package.description.split(',').length - 1" />
                  </span>
                  </small>
                 
                </p>
              </center>
            </div>
            <div class="card-body">
              <center>
                <hr />
                <p class="card-title lead">
                  &#8358;{{ single_package.price.toLocaleString() }}
                  <span class="text-muted" v-if="single_package.package_type == 'monthly'">/mo</span>
                  <span class="text-muted" v-else>/yr</span>
                </p>
              </center>
            </div>
            <center>
              <div class="card-footer">
                <hr />
                <slot name="footer">
                  <button
                    class="btn btn-dark"
                    @click.prevent="fundWallet(single_package.price)"
                  >
                    Subscribe
                  </button>
                </slot>
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>

    <!-- Activation Form -->
    <section class="col-12 col-md-6">
      <h3>Activate</h3>
      <small>Input the activation code sent to your company email</small>
      <form @submit.prevent="activateSubscription">
        <div class="form-group">
          <input
            type="text"
            id="activationCode"
            v-model="code"
            class="form-control"
            placeholder="Input Code"
            required
          />
        </div>
        <button class="btn btn-success col-12 col-md-8" type="submit">
          Activate
        </button>
      </form>
    </section>
  </div>
</template>


<script>
import Categories from "@/javascript/Api/Categories";
import Swal from "sweetalert2";
import Details from "@/javascript/Api/BusinessDetails";
import PaystackPop from "@paystack/inline-js";
import axios from "axios";

export default {
  data() {
    return {
      rows: {
        products: [
          {
            name: null,
            category_id: null,
            stock: 0,
            price: null,
            code: null,
          },
        ],
      },
      loading: false,
      categories: null,
      details: null,
      packages: null,
      business: null,
      code: null,
      selectedPackageType: "freebies", // Default selected package type
    };
  },
  computed: {
    displayedPackages() {
      // Filter packages based on selectedPackageType
      return this.packages ? this.packages[this.selectedPackageType] : [];
    },
  },
  methods: {
    getpackages() {
      this.loading = true;
      axios
        .get("https://api.ngmkt.site/api/admin/packages")
        .then((result) => {
          this.packages = result.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    getBusinessDetails() {
      Details.details().then((result) => {
        this.business = result.data;
      });
    },
    fundWallet(price) {
      const handler = PaystackPop.setup({
        key: "pk_live_a0d5def75f9107fd5fe5346be015d9f824f24a97",
        email: this.business.email,
        amount: price * 100,
        currency: "NGN",
        callback: function (response) {
          // Handle success
        },
        onClose: function () {
          window.location.reload();
        },
      });
      handler.openIframe();
    },
    activateSubscription() {
      this.loading = true;
      Details.activate({ code: this.code })
        .then((result) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: result.data.message,
            customClass: "Swal-wide",
            showConfirmButton: false,
            timer: 3000,
          });
          window.location.reload();
          this.loading = false;
        })
        .catch((err) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: err.response.data.message,
            customClass: "Swal-wide",
            showConfirmButton: false,
            timer: 3000,
          });
          this.loading = false;
        });
    },
    switchPackageType(type) {
      // Update selected package type
      this.selectedPackageType = type;
    },
  },
  created() {
    this.getBusinessDetails();
    this.getpackages();
  },
};
</script>
