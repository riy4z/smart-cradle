import api from "../../Components/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export async function getUsername() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error("Cannot find Token");
      }
  
      const decode = jwtDecode(token);
      return decode;
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error; // Propagate the error
    }
  }
export async function authenticate(username){
  try {
      return await api.post('/authenticate', {username})
  } catch (error) {
      return { error : "Username doesn't exist...!"}
  }
}

export async function getUser({username}){
    try {
        const {data} = await api.get(`/user/${username}`)
        return {data};
    } catch (error) {
        return {error : "Password doesn't match..!"}
    }
}

export async function verifyPassword({username, password}){
    try {
      if(username){
        const {data} = await api.post('/login', {username, password})
        return Promise.resolve({data});
     }
    } catch (error) {
        return Promise.reject({error : "Password doesn't match...!"})
    }
}

export async function registerUser(credentials ) {
  try {
      console.log(credentials);
      const { data: { msg, error }, status } = await api.post(`/register`, credentials );
      
      let { username, email, location } = credentials;
      console.log(credentials)

      if (status === 201) {
          await api.post('/registerMail', { username, userEmail: email });
          const userID = await api.get(`/user/${username}`)
          console.log(userID)
          await api.post('/addUserLocation', {userId:userID.data._id, locationId:location})
      }

      return { msg, error };
  } catch (error) {
      if (error.response) {
          const { data } = error.response;
          return { error: data.error };
      } else {
          console.error('Error occurred during registration:', error);
          return { error: 'Internal server error' };
      }
  }

}

export async function generateOTPbyEmail(email) {
  try {
      const { data: { code }, status } = await api.get('/generateOTPbyEmail', { params: { email } });

      if (status === 201) {
          let text = `<!DOCTYPE html>
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <title>
      
          </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
              #outlook a {
                  padding: 0;
              }
      
              .ReadMsgBody {
                  width: 100%;
              }
      
              .ExternalClass {
                  width: 100%;
              }
      
              .ExternalClass * {
                  line-height: 100%;
              }
      
              body {
                  margin: 0;
                  padding: 0;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              table,
              td {
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
      
              img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                  -ms-interpolation-mode: bicubic;
              }
      
              p {
                  display: block;
                  margin: 13px 0;
              }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
              @media only screen and (max-width:480px) {
                  @-ms-viewport {
                      width: 320px;
                  }
                  @viewport {
                      width: 320px;
                  }
              }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
              <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
              </xml>
              <![endif]-->
          <!--[if lte mso 11]>
              <style type="text/css">
                .outlook-group-fix { width:100% !important; }
              </style>
              <![endif]-->
      
      
          <style type="text/css">
              @media only screen and (min-width:480px) {
                  .mj-column-per-100 {
                      width: 100% !important;
                  }
              }
          </style>
      
      
          <style type="text/css">
          </style>
      
      </head>
      
      <body style="background-color:#f9f9f9;">
      
      
          <div style="background-color:#f9f9f9;">
      
      
              <!--[if mso | IE]>
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
                  <td
                     style="vertical-align:bottom;width:600px;"
                  >
                <![endif]-->
      
                                  <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
      
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
      
                                          <tr>
                                              <td align="center" style="font-size:0px;word-break:break-word;">
      
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                      <tbody>
                                                          <tr>
                                                              <td style="width:150px;">
      
                                                                  <img height="auto" src="https://i.postimg.cc/zDyzXGB0/EZ-Route-logos-transparent.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" />
      
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
      
                                                  <div style="font-family:'Calibri','Arial',sans-serif;font-size:32px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                      Registration Verification
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Calibri',Arial,sans-serif;font-size:22px;line-height:22px;text-align:left;color:#555;">
                                                      Hi,
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                  Your Registration OTP is ${code}. <hr></hr>
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                      Need Help?
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:center;color:#555;">
                                                      Please send feedback or bug info<br> to <a href="mailto:easyroutea2z@gmail.com" style="color:#2F67F6">easyroutea2z@gmail.com</a>
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                      </table>
      
                                  </div>
      
                                  <!--[if mso | IE]>
                  </td>
                
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                      <tbody>
                          <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
                  <td
                     style="vertical-align:bottom;width:600px;"
                  >
                <![endif]-->
      
                                  <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
      
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                          <tbody>
                                              <tr>
                                                  <td style="vertical-align:bottom;padding:0;">
      
                                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      
      
                                                          <tr>
                                                              <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
      
                                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:0;text-align:center;color:#575757;">
                                                                      <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                                  </div>
      
                                                              </td>
                                                          </tr>
      
                                                      </table>
      
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
      
                                  </div>
      
                                  <!--[if mso | IE]>
                  </td>
                
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            <![endif]-->
      
      
          </div>`;
          await api.post('/registerMail', { userEmail: email, text, subject: "Registration OTP" });
      }

      return Promise.resolve(code);
  } catch (error) {
      return Promise.reject({ error });
  }
}

export async function verifyOTPbyEmail({email, code}){
  try {
      const {data, status} = await api.get('/verifyOTPbyEmail', {params : {email, code}})
      return {data, status}
  } catch (error) {
      return Promise.reject(error);
  }

}

export async function generateOTP(username){
    try {
        const {data : {code}, status} = await api.get('/generateOTP', {params : {username}})
    
        if (status === 201){

          let {data : {email}} = await getUser({username});
          let text = `<!DOCTYPE html>
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <title>
      
          </title>
          <!--[if !mso]><!-- -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
              #outlook a {
                  padding: 0;
              }
      
              .ReadMsgBody {
                  width: 100%;
              }
      
              .ExternalClass {
                  width: 100%;
              }
      
              .ExternalClass * {
                  line-height: 100%;
              }
      
              body {
                  margin: 0;
                  padding: 0;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              table,
              td {
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
      
              img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                  -ms-interpolation-mode: bicubic;
              }
      
              p {
                  display: block;
                  margin: 13px 0;
              }
          </style>
          <!--[if !mso]><!-->
          <style type="text/css">
              @media only screen and (max-width:480px) {
                  @-ms-viewport {
                      width: 320px;
                  }
                  @viewport {
                      width: 320px;
                  }
              }
          </style>
          <!--<![endif]-->
          <!--[if mso]>
              <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
              </xml>
              <![endif]-->
          <!--[if lte mso 11]>
              <style type="text/css">
                .outlook-group-fix { width:100% !important; }
              </style>
              <![endif]-->
      
      
          <style type="text/css">
              @media only screen and (min-width:480px) {
                  .mj-column-per-100 {
                      width: 100% !important;
                  }
              }
          </style>
      
      
          <style type="text/css">
          </style>
      
      </head>
      
      <body style="background-color:#f9f9f9;">
      
      
          <div style="background-color:#f9f9f9;">
      
      
              <!--[if mso | IE]>
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
                  <td
                     style="vertical-align:bottom;width:600px;"
                  >
                <![endif]-->
      
                                  <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
      
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
      
                                          <tr>
                                              <td align="center" style="font-size:0px;word-break:break-word;">
      
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                      <tbody>
                                                          <tr>
                                                              <td style="width:150px;">
      
                                                                  <img height="auto" src="https://i.postimg.cc/zDyzXGB0/EZ-Route-logos-transparent.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" />
      
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
      
                                                  <div style="font-family:'Calibri','Arial',sans-serif;font-size:32px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                      Recover your password
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Calibri',Arial,sans-serif;font-size:22px;line-height:22px;text-align:left;color:#555;">
                                                      Hi <b>${username},</b>
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                  Your password recovery OTP is ${code}. <hr></hr>
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                      Need Help?
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:center;color:#555;">
                                                      Please send feedback or bug info<br> to <a href="mailto:easyroutea2z@gmail.com" style="color:#2F67F6">easyroutea2z@gmail.com</a>
                                                  </div>
      
                                              </td>
                                          </tr>
      
                                      </table>
      
                                  </div>
      
                                  <!--[if mso | IE]>
                  </td>
                
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
            >
              <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
      
      
              <div style="Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                      <tbody>
                          <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                  <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      
              <tr>
            
                  <td
                     style="vertical-align:bottom;width:600px;"
                  >
                <![endif]-->
      
                                  <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
      
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                          <tbody>
                                              <tr>
                                                  <td style="vertical-align:bottom;padding:0;">
      
                                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      
      
                                                          <tr>
                                                              <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
      
                                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:0;text-align:center;color:#575757;">
                                                                      <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                                  </div>
      
                                                              </td>
                                                          </tr>
      
                                                      </table>
      
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
      
                                  </div>
      
                                  <!--[if mso | IE]>
                  </td>
                
              </tr>
            
                        </table>
                      <![endif]-->
                              </td>
                          </tr>
                      </tbody>
                  </table>
      
              </div>
      
      
              <!--[if mso | IE]>
                </td>
              </tr>
            </table>
            <![endif]-->
      
      
          </div>`;
          await api.post('/registerMail', {username, userEmail: email, text, subject: "Password Recovery OTP"})  
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error})
    }
}

export async function verifyOTP({username, code}){
    try {
        const {data, status} = await api.get('/verifyOTP', {params : {username, code}})
        return {data, status}
    } catch (error) {
        return Promise.reject(error);
    }

}


export async function resetPassword({username, password}){
    try {
        const {data, status} = await api.put('/resetPassword', {username, password});
        return Promise.resolve({data, status})
    } catch (error) {
        return Promise.reject({error})
    }
}


