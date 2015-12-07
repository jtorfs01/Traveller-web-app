rows.forEach(function getoutput(item) {

  connectionpool.getConnection(function(err, connection) {
    console.log('Trying to connect');
    console.log(req.body.password);
      if (!err) {
          console.log(item.USER_ID);
          connectionpool.query('SELECT * FROM ACTIVITY WHERE LOGIN_ID ='  + connection.escape(item.USER_ID)),
              function (err, rows) {
                  if (err) {
                      console.error(err);
                      res.statusCode = 500;
                      res.send({
                          result: 'error',
                          err: err.code
                      });
                      console.log('It doesnt work error 500');
                  }
                  if (rows.length == 0){
                      res.render('viewUserActivities', { title: 'Activity - No activities found' });
                  }
                  res.render('viewUserActivities',{
                      result: 'success',
                      err: '',
                      //  fields: fields,
                      activities: rows,
                      title: "View your activities",
                  });
                  console.log('It works');
                  connection.release();
            }
      } else {
          console.error('CONNECTION error: ', err);
          res.statusCode = 503;
          res.send({
              result: 'error',
              err: err.code
          });
          console.log('It does not work...');

      }


  });



});