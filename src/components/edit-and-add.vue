<template>
  <n-modal
  v-model:show="state.show"
  style="width: 100%; max-width: 360px"
  preset="card"
  class="edit-and-add"
  :title="state.title"
  size="small"
  :mask-closable="false"
  :bordered="false"
  >
    <n-form :model="state.form" v-if="state.form.info">
      <n-form-item label="Tileset Url" :rule="[required]" path="url">
        <n-input v-model:value="state.form.url"></n-input>
      </n-form-item>
      
      <n-form-item label="City" :rule="[required]" path="location">
        <n-cascader
          v-model:value="state.form.location"
          :options="state.options"
          check-strategy="child"
          placeholder="Please Select city"
          @update:value="(a, e, o) => { state.locationArray = o.map(i => i.label) }"
        />
      </n-form-item>
      <n-form-item label="Title" :rule="[required]" path="info.title">
        <n-input v-model:value="state.form.info.title"></n-input>
      </n-form-item>
      <n-form-item label="Description" path="info.description">
        <n-input v-model:value="state.form.info.description" type="textarea"></n-input>
      </n-form-item>
      <n-form-item label="Author" path="info.author">
        <n-input v-model:value="state.form.info.author"></n-input>
      </n-form-item>
      <n-form-item label="Date" path="info.date">
        <n-date-picker v-model:value="state.form.info.date" style="width: 100%" type="date" />
      </n-form-item>
      <n-form-item label="Camera Position" path="info.camera">
        <n-input-number v-for="(i, idx) in state.form.info.camera" v-model:value="state.form.info.camera[idx]"></n-input-number >
      </n-form-item>
      <n-form-item label="Control Position" path="info.control">
        <n-input-number v-for="(i, idx) in state.form.info.control" v-model:value="state.form.info.control[idx]"></n-input-number >
      </n-form-item>
    </n-form>
    <div class="footer">
      <n-button type="primary" @click="submit" :disabled="state.loading">
        <span>Submit</span>
        <span v-if="state.loading">....</span>
      </n-button>
      <n-button @click="state.show = false">Cancel</n-button>
    </div>
  </n-modal>
</template>

<script>
import { reactive, watch} from 'vue'
import { pcTextArr } from "element-china-area-data";
import request from '@/service/index.js'
export default {
  props: {
    form: Object
  },
  setup(props, { emit }){
    const state = reactive({
      form: {},
      show: false,
      title: 'Add Item',
      options: pcTextArr,
      loading: false,
      locationArray: []
    })
    const required = { required: true, message: "Plase input required field", trigger: "blur" }
    watch(() => props.form, () => {
      state.loading = false
      state.form = JSON.parse(JSON.stringify( props.form ))
      if( state.form.uuid ){
        state.title = 'Edit Item' 
        state.form.location = state.form.location.split(',')[1]
        state.form.info = JSON.parse(state.form.info)
      }else{
        state.title = 'Add Item'
        state.form = {
          location: null,
          info: {
            title: "",
            description: "",
            author: "",
            date: null,
            camera: [0, 150, 150],
            control: [0,0,0]
          },
          url: "",
          coordinates: ""
        }
      }
      state.show = true
    }, { deep: true })

    const submit = async () => {
      state.loading = true
      state.form.location = state.locationArray.join(',')
      state.form.info = JSON.stringify(state.form.info)  
      if(state.form.uuid){
        request.edit(state.form.uuid, state.form).then(res => {
          if(res.success) {
            emit('ok')
            state.show = false
          }
        })
      }else{
        request.post(state.form).then(res => {
          if(res.success) {
            emit('ok')
            state.show = false
          }
        }) 
      }
    }
    return {
      submit,
      required,
      state
    }
  }
}
</script>

<style lang="less">
.edit-and-add{
  .footer{
    display: flex;
    justify-content: flex-end; 
    .n-button{
      margin-left: 20px;
    }
  }
}
</style>