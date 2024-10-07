import mojo, {yamlConfigPlugin} from '@mojojs/core';
import { type MojoApp } from '@mojojs/core';

export const app: MojoApp = mojo();

app.plugin(yamlConfigPlugin);
app.secrets = app.config.secrets;

app.get('/').to('example#welcome');

app.start();
