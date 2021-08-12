<template>
  <div>
    <ul>
      <li v-for="(p, index) in phoneBooks" :key="index">
        <pre>
          {{ p }}
        </pre>
      </li>
    </ul>
  </div>
</template>

<script>
import { client } from '../api-client/main.client'
export default {
  data () {
    return {
      phoneBooks: [],
    }
  },
  async created () {
    this.phoneBooks = await client.get('/phone-books', {
      params: {
        page: 1,
        limit: 10,
      },
    })
  },
}
</script>
