const { resyncToken } = require('./utils');
const { sendResult } = require('./../../infrastructure/utils');

const action = async (req, res) => {

  const resyncTokenResult = await resyncToken(req);

  if(resyncTokenResult.success) {
    res.redirect(`userDevices/${req.body.serialNumber}/${req.body.uid}`)
  }
  else {
    sendResult(req, res, 'userDevices/views/resyncToken', {
      csrfToken: req.csrfToken(),
      code1: '',
      code2: '',
      validationMessages: resyncTokenResult.validationResult.messages,
      uid: req.body.uid,
      serialNumber: req.body.serialNumber,
    });
  }

};

module.exports = action;
