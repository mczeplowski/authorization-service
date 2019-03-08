import nconf from 'nconf';
import App from '../src/App';

nconf
  .argv()
  .use('memory');

const application = new App();

application.run();
