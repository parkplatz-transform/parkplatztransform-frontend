import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

const LOCAL_STORAGE_KEY = 'data'
const WAIT_TIME_BEFORE_SAVE = 3000

class SegmentCache {

  constructor () {
    this.dataString = null
    this.isSaving = false
    this.lockTimeout = null
  }

  getFromCache () {
    try {
      const compressed = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      this.dataString = decompressFromUTF16(compressed)
      console.log('from cache', this.dataString)
      return JSON.parse(this.dataString)
    }
    catch (error) {
      console.log('nothing in cache')
      return {}
    }
  }

  saveToCacheSoon (data) {
    if (!data || Object.keys(data).length === 0) {
      return
    }

    if (!this.isSaving) {
      window.clearTimeout(this.lockTimeout)
      this.lockTimeout = window.setTimeout(() => {
        this.isSaving = true

        const dataString = this._getDataWithoutDetailsStringified(data)

        // abort if data equals last data
        if (dataString === this.dataString){
          this.isSaving = false
          return
        }

        console.log('compressing data and saving to storage')
        const start = Date.now()
        const compressed = compressToUTF16(dataString)
        localStorage.setItem('data', compressed)
        this.isSaving = false

        const compressionTime = (Date.now() - start)
        console.log(`compressing and saving took ${compressionTime / 1000} seconds.`)

      }, WAIT_TIME_BEFORE_SAVE)
    }
  }

  // TODO
  _getDataWithoutDetailsStringified (data) {
    return JSON.stringify(data)
  }

}

export default new SegmentCache()