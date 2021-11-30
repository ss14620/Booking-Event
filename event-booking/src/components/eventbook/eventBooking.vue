<template>
  <v-card elevation="3" class="mx-10 my-10" height="100%">
    
    <v-card-title>
      <v-icon large left color="orange"> mdi-calendar </v-icon>
      <span class="text-h6 font-weight-bold">Events ({{ count }})</span>
      <v-spacer></v-spacer>
      <v-text-field outlined dense placeholder="Search..."  v-model="search"/>
    </v-card-title>

    <h3 class="font-weight-light" v-if="!filteredList.length"> No results found!</h3>

    <v-row>
      <v-col v-for="item in filteredList" :key="item.id" cols="4">
        <v-card class="ml-6 mt-6 rounded-0" max-width="400">
          <v-img height="200px" :src="item.src">
            <v-card-title class="white--text align-end">{{
              item.title
            }}</v-card-title>
          </v-img>

          <v-card-text class="text--primary mb-3">
            <span class="float-left text-subtitle-1 font-weight-bold">{{
              item.eventDate
            }}</span>
            <span class="float-right text-subtitle-1 font-weight-bold"
              >Tickets Available:
              <span class="orange--text">{{ item.seatsAvailable }}</span></span
            >
          </v-card-text>

          <v-card-actions>
            <v-btn
              block
              outlined
              @click="bookEvent(item.id, item.seatsAvailable, item.src)"
              color="orange"
              v-if="item.status == 'Open'"
            >
              <v-icon left> mdi-calendar-check </v-icon>
              Book Now
            </v-btn>
            <v-btn disabled outlined block v-if="item.status == 'Sold'">
              <v-icon left> mdi-calendar-remove </v-icon>
              Sold Out
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>


<script>
export default {
  data() {
    return {
      count: 0,
      search: '',
      items: [
        {
          id: "1",
          title: "Karoke Event",
          src: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
          status: "Sold",
          seatsAvailable: "N/A",
          eventDate: "30th Nov,2021",
        },
        {
          id: "2",
          title: "StandUp Comedy Event",
          src: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
          status: "Open",
          seatsAvailable: "4",
          eventDate: "3rd Dec,2021",
        },
        {
          id: "3",
          title: "TedEx Event",
          src: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
          status: "Open",
          seatsAvailable: "3",
          eventDate: "1st Dec,2021",
        },
        {
          id: "4",
          title: "Global Summit Event",
          src: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
          status: "Sold",
          seatsAvailable: "N/A",
          eventDate: "2nd Dec,2021",
        },
        {
          id: "5",
          title: "Cooking Competition",
          src: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
          status: "Sold",
          seatsAvailable: "N/A",
          eventDate: "11th Dec,2021",
        },
        {
          id: "6",
          title: "Movie",
          src: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
          status: "Open",
          seatsAvailable: "7",
          eventDate: "30th Dec,2021",
        },
      ],
      intialData: [],
    };
  },
  methods: {
    bookEvent(id, seats, src) {
      this.$router.push({
        name: "AddEvent",
        params: { id: id, seatsAvailable: seats, src: src },
      });
    },
    countEvent() {
      this.count = this.items.length;
    },
  },
  created() {
    if (!localStorage.getItem("eventData")) {
      console.log("Inside");
      localStorage.setItem("eventData", JSON.stringify(this.items));
    }
    this.intialData = JSON.parse(localStorage.getItem("eventData"));
    this.countEvent();
  },
  mounted() {
    console.log("Mounted");
    this.intialData = JSON.parse(localStorage.getItem("eventData"));
  },
  computed:{
     filteredList() {
      return (this.intialData.filter(item => {
        return item.title.includes(this.search)
      }) || 'No Event Available')
    }
  }
};
</script>