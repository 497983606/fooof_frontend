<template>
  <n-config-provider  :theme-overrides="commonStyle" >
    <n-dialog-provider>
      <n-message-provider>
        <router-view></router-view>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script>

import { createDiscreteApi} from 'naive-ui'
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  setup(){
    const { dialog, message, notification} = createDiscreteApi(["dialog", "message", "notification"])
    window.$dialog = dialog
    window.$message = message
    window.$notification = notification
    
    return {
      commonStyle: {
          common: {
            primaryColor: '#8c16b9',
            primaryColorHover: '#8c16b9',
            primaryColorPressed: "#8c16b9",
            borderRadius: "4px",
            fontSize: '14px',
            paddingMedium: "0px",
            borderRadius: '2px'
          },
          Button: {
            paddingTiny: "0 5px",
            paddingSmall: "0 8px",
            paddingMedium: "0 10px"
          }
      }
    }
  }
})
</script>
