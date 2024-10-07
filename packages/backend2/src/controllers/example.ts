import type {MojoContext} from '@mojojs/core';

export default class Example {
  // Render template "example/welcome.html.tmpl" with message
  async welcome (ctx: MojoContext): Promise<void> {
    ctx.stash.msg = 'Welcome to my mojo.js web framework!';
    await ctx.render();
  }
}
