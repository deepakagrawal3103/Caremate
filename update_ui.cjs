const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Typography: Remove font-serif
    content = content.replace(/font-serif/g, 'font-sans');
    
    // Text sizes: Elder-friendly minimum 16px (text-base)
    content = content.replace(/text-\[10px\]/g, 'text-base');
    content = content.replace(/text-\[11px\]/g, 'text-base');
    content = content.replace(/text-\[12px\]/g, 'text-base');
    content = content.replace(/text-\[13px\]/g, 'text-base');
    content = content.replace(/text-\[15px\]/g, 'text-lg');
    content = content.replace(/text-xs/g, 'text-base');
    content = content.replace(/text-sm/g, 'text-base');
    
    // Background colors
    content = content.replace(/bg-\[#fbf9f6\]/g, 'bg-background');
    content = content.replace(/bg-\[#f5f6f4\]/g, 'bg-white border border-border');
    content = content.replace(/bg-\[#f4f5f4\]/g, 'bg-white border border-border');
    content = content.replace(/bg-\[#eaeaeb\]/g, 'hover:bg-gray-50');
    content = content.replace(/bg-\[#dbe8f3\]/g, 'bg-blue-50');
    content = content.replace(/bg-\[#113757\]/g, 'bg-primary');
    content = content.replace(/bg-\[#fce9e8\]/g, 'bg-red-50');
    content = content.replace(/bg-\[#eaddce\]/g, 'bg-amber-50');
    content = content.replace(/bg-\[#3e5f7a\]/g, 'bg-primary/80');
    content = content.replace(/bg-\[#e7e5df\]/g, 'bg-gray-100');
    content = content.replace(/bg-\[#f0ece5\]/g, 'bg-gray-50 border border-border');
    
    // Text colors
    content = content.replace(/text-\[#113757\]/g, 'text-gray-900'); // Primary text color #111827 -> text-gray-900
    content = content.replace(/text-\[#475569\]/g, 'text-secondary');
    content = content.replace(/text-\[#64748b\]/g, 'text-secondary');
    content = content.replace(/text-\[#a1a1aa\]/g, 'text-gray-400');
    content = content.replace(/text-\[#8e292c\]/g, 'text-red-600');
    content = content.replace(/text-\[#c04847\]/g, 'text-red-500');
    content = content.replace(/text-\[#93302c\]/g, 'text-red-700');
    content = content.replace(/text-\[#6c3e39\]/g, 'text-red-800');
    content = content.replace(/text-\[#a8b8d0\]/g, 'text-gray-500');
    content = content.replace(/text-\[#9cbcd5\]/g, 'text-blue-200');

    // Shadow & borders
    content = content.replace(/shadow-ambient/g, 'shadow-lg');
    content = content.replace(/border-none/g, ''); // Remove border-none so cards can have borders

    // Buttons specific sizing (larger targets)
    content = content.replace(/px-4 py-3/g, 'px-6 py-4');
    content = content.replace(/px-8 py-3.5/g, 'px-8 py-4 text-lg');
    content = content.replace(/w-11 h-11/g, 'w-14 h-14'); // larger icons in actions
    content = content.replace(/w-12 h-12/g, 'w-14 h-14');
    content = content.replace(/rounded-xl/g, 'rounded-2xl');
    content = content.replace(/rounded-lg/g, 'rounded-xl');

    // Stroke replacements for circles
    content = content.replace(/stroke="#f2f0e9"/g, 'stroke="#E5E7EB"');
    content = content.replace(/stroke="#6c3e39"/g, 'stroke="#2563EB"'); // make risk score primary blue if ok, or maybe keep red? Let's leave as is or change to accent/primary. I'll change to primary.
    
    fs.writeFileSync(filePath, content, 'utf8');
}

walk(directoryPath, processFile);
console.log("UI updated!");
