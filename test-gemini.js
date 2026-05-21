const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').find(line => line.startsWith('GOOGLE_API_KEY='));
const key = env ? env.split('=')[1].trim() : '';
async function list() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    console.log(JSON.stringify(data.models.map(m => m.name)));
  } catch(e) {
    console.error(e);
  }
}
list();
