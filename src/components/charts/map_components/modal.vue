<template>
  <!-- Modal -->
  <div class="modal fade" data-backdrop="false" id="event_modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title"><b>{{event_date}}</b></h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h3>{{event_msg}}</h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="hide">Okay</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  data() {
    return {
      name:"Modal"
    }
  },
  props: {
    show_modal: Boolean,
    event_msg: String,
    event_date: String,
  },
  created() {
    console.log("modal created", this.show_modal)
  },
  mounted() {
    console.log("modal mounted", this.show_modal, this.event_msg, this.event_date)
  },
  updated() {
    console.log("modal updated", this.show_modal, this.event_msg, this.event_date)
    this.display()
  },
  methods: {
    display() {
      if (!this.show_modal) return
      let options = undefined
      document.body.appendChild(document.getElementById('event_modal'))
      this.modal = new Modal(document.getElementById('event_modal'), options)
      this.modal.show()
      
      let is_open = true
      this.$emit('toggle', is_open)
    },
    hide() {
      console.log("modal hide")
      let is_open = false
      this.$emit('toggle', is_open)
    }
  }
}
</script>

<style>
.modal-backdrop {
  z-index: -1;
}
</style>