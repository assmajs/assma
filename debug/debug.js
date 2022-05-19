/*
Debug command: npx babel-node --presets @babel/preset-env packages/debug.tmp.js
List all files by date (desc): find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./coverage/*" -exec ls -lt {} +

Remove a remote tag:
git tag -d v1.0.0-alpha.1
git push origin :refs/tags/v1.0.0-alpha.1

EOF git issue:
git config --global core.autocrlf true
git config --global core.safecrlf warn
*/

import { compile } from "../packages/compiler/src/compile";

const input = `
    <div>
        {this.state.active}
        <img src="assets/logo.png" />
        <h1>Hello World</h1>
        <br />
        <Foo>
            bar
        </Foo>
        <br />
        <button onClick={this.onClick}>Toggle</button>
    </div>
`;
console.log(JSON.stringify(compile(input)));

