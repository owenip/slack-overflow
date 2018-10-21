exports.handler = (event, context, callback) => {
  let https = require('https')
  let qs = require('querystring')

  let { text = '' } = qs.parse(event.body)

  let params = qs.stringify({
    site: 'stackoverflow.com',
    q: text,
  })

  https.get(`https://api.stackexchange.com/search/advanced?${params}`, resp => {
    let data = ''
    resp.on('data', chunk => (data += chunk))
    resp.on('end', () => {
      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response_type: 'in_channel',
          text: `Hopefully one of these answers your question!`,
          attachments: [
            {
              text: JSON.parse(data).has_more,
            },
          ],
        }),
      })
    })
  })
}
