import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { instance } from '../../api-client/main.client'
import { getSomething } from '../../api/_example'

describe('API Client', () => {
  const expectedResponse = 'RESPONSE'
  const expectedError = 'ERROR'

  describe('correctly pick which instance to use in performing network request', () => {
    test('correctly pick default instance', (done) => {
      const mock = new MockAdapter(instance)
      const err = new Error() 
      err.message = expectedError
      mock
        .onAny()
        .replyOnce(500, err)
      
      getSomething()
        .then(() => {
          done(new Error('request shouldn\'t be success'))
        })
        .catch((e) => {
          expect(e).toEqual(expect.any(Error))
          expect(e.response.data.message).toEqual(expectedError)
          done()
        }).finally(() => {
          mock.reset()
        })
    })

    test('correctly pick default instance with overridden config', (done) => {
      const mock = new MockAdapter(instance)
      const customConfig = {
        baseURL: 'https://some-custom.endpoint'
      }
      const err = new Error() 
      err.message = expectedError
      mock
        .onAny()
        .replyOnce(500, err)
      
      getSomething.call(customConfig)
        .then(() => {
          done(new Error('request shouldn\'t be success'))
        })
        .catch((e) => {
          expect(e).toEqual(expect.any(Error))
          expect(e.config.baseURL).toEqual(customConfig.baseURL)
          done()
        })
    })

    test('correctly pick provided axios instance', (done) => {
      const expectedHeaderKey = 'x-axios-instance'
      const expectedHeaderValue = 'custom'
      const customInstance = axios.create({
        headers: {
          [expectedHeaderKey]: expectedHeaderValue
        }
      })
      
      new MockAdapter(customInstance)
        .onAny()
        .replyOnce(200, null)
      
      getSomething.call(customInstance)
        .then((res) => {
          expect(res.config.headers).toEqual(
            expect.objectContaining({
              [expectedHeaderKey]: expectedHeaderValue
            })
          )
          done()
        })
        .catch(done)
    })

    test('correctly pick mocked instance', (done) => {
      const customMock = new MockAdapter(axios.create({}))
      customMock
        .onAny()
        .replyOnce(200, expectedResponse)
      
      getSomething.call(customMock)
        .then((res) => {
          expect(res.data).toEqual(expectedResponse)
          done()
        })
        .catch(done)
    })
  })
})