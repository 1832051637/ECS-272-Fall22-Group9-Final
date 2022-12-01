<template>
  <!-- Modal -->
  <div class="modal" data-backdrop="false" id="exampleModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="hide">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
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
      modal: undefined,
      // modalShow: false
    }
  },
  props: {
    show_modal: Boolean,
  },
  created() {
    console.log("modal created", this.show_modal)
    // this.modalShow = this.show_modal
  },
  mounted() {
    console.log("modal mounted", this.show_modal)
    // this.modalShow = this.show_modal
  },
  updated() {
    console.log("modal updated", this.show_modal)
    this.display()
    // this.modalShow = this.show_modal
  },
  methods: {
    display() {
      if (!this.show_modal) return
      let options = undefined
      document.body.appendChild(document.getElementById('exampleModal'))
      this.modal = new Modal(document.getElementById('exampleModal'), options)
      this.modal.show()
    },
    hide() {
      console.log("modal hide")

      this.$emit('closed', false)
    }
  }
}
</script>

<style>
.modal-backdrop {
  z-index: -1;
}
</style>