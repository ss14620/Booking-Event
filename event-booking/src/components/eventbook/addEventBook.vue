<template>
  <v-card class="mx-4 mt-10" height="100%">
    <v-row>
      <v-col cols="6">
        <v-card class="ml-6 mt-6 rounded-0" max-width="400">
          <v-img height="200px" :src="imgSource"> </v-img>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-alert dense type="success" v-if="eventBookedStatus">
          <strong>Booking Completed Successfully</strong>
        </v-alert>
        <p class="font-weight-bold" style="text-align: left">Name</p>
        <v-text-field
          v-model.trim="name"
          label="Name"
          required
          outlined
          dense
          class="mt-4"
          :error-messages="nameErrors"
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>

        <p class="font-weight-bold" style="text-align: left">Email</p>
        <v-text-field
          v-model.trim="email"
          label="E-mail"
          dense
          outlined
          required
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>

        <p class="font-weight-bold" style="text-align: left">Phone No.</p>
        <v-text-field
          v-model.trim="phoneNumber"
          label="Phone No."
          type="number"
          outlined
          dense
          required
          :error-messages="phoneNumberErrors"
          @input="$v.phoneNumber.$touch()"
          @blur="$v.phoneNumber.$touch()"
        ></v-text-field>

        <p class="font-weight-bold" style="text-align: left">Seat Available</p>
        <v-select
          outlined
          label="Seats"
          v-model="seatBooked"
          :items="eventSeatsAvailable"
          :error-messages="seatBookedErrors"
          @change="$v.seatBooked.$touch()"
          @blur="$v.seatBooked.$touch()"
          dense
        ></v-select>
        <template v-if="seatBooked != 0">
          <div v-for="count in parseInt(seatBooked)" :key="count">
            <p class="font-weight-bold" style="text-align: left">
              Name of Attendee {{ count }}
            </p>

            <v-text-field
              v-model.trim="attendeeName.name[count]"
              :label="'Name of Attendee ' + count"
              required
              outlined
              dense
              class="mt-4"
              :rules="attendeeRules"
            >
            </v-text-field>
          </div>
        </template>
        <v-btn
          depressed
          color="primary"
          class="float-left"
          @click="bookTicket"
          :disabled="!valid"
        >
          Submit
        </v-btn>
        <v-btn depressed class="ml-4 float-left" @click="cancelBooking">
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  validations: {
    name: { required },
    email: { required, email },
    seatBooked: { required },
    phoneNumber: { required },
  },

  data() {
    return {
      eventBookedStatus: false,
      valid: true,
      seatBooked: "",
      phoneNumber: "",
      email: "",
      name: "",
      attendeeName: {
        name: [],
      },
      eventId: "",
      eventSeatsAvailable: "",
      imgSource: "",
    };
  },
  computed: {
    attendeeRules(){
      return [(v) => !!v || 'Attendee is required']
    },
    seatBookedErrors() {
      const errors = [];
      if (!this.$v.seatBooked.$dirty) return errors;
      !this.$v.seatBooked.required && errors.push("Seat is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.phoneNumber.$dirty) return errors;
      !this.$v.phoneNumber.required && errors.push("Phone Number is required");
      return errors;
    },
    // attendeeNameErrors() {
    //   const errors = [];
    //   if (!this.$v.attendeeName.$dirty) return errors;
    //   !this.$v.attendeeName.required && errors.push("Name is required.");
    //   return errors;
    // },
  },
  methods: {
    cancelBooking() {
      this.$router.push("/");
    },
    bookTicket() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let bookingEventObj = {};
      bookingEventObj["name"] = this.name;
      bookingEventObj["email"] = this.email;
      bookingEventObj["contactDetails"] = this.phoneNumber;
      bookingEventObj["seatBooked"] = this.seatBooked;
      bookingEventObj["attendeeDetails"] = this.attendeeName;

      console.log(bookingEventObj);

      let data = JSON.parse(localStorage.getItem("eventData"));
      let eventId = JSON.parse(localStorage.getItem("eventId"));
      data.map((item) => {
        if (item.id == eventId) {
          item["seatsAvailable"] = item.seatsAvailable - this.seatBooked;
          if (item["seatsAvailable"] == 0) {
            item["status"] = "Sold";
          }
        }
        return item;
      });
      this.eventBookedStatus = true;
      localStorage.setItem("eventData", JSON.stringify(data));
      if (this.eventBookedStatus) {
        this.name = "";
        this.email = "";
        this.phoneNumber = "";
        this.seatBooked = "";
        this.attendeeName = {};
      }
      this.$v.$reset();
      this.$router.push("/");
    },
  },
  async created() {
    localStorage.setItem("imgSource", this.$route.params.src);
    localStorage.setItem(
      "eventSeatAvailable",
      JSON.stringify(this.$route.params.seatsAvailable)
    );
    localStorage.setItem("eventId", this.$route.params.id);
    this.eventSeatsAvailable = Array.from(
      { length: JSON.parse(localStorage.getItem("eventSeatAvailable")) },
      (x, i) => i + 1
    );
    this.imgSource = this.$route.params.src;
  },
  mounted() {
    this.eventSeatsAvailable = Array.from(
      { length: JSON.parse(localStorage.getItem("eventSeatAvailable")) },
      (x, i) => i + 1
    );
    this.imgSource = this.$route.params.src;
  },
};
</script>
