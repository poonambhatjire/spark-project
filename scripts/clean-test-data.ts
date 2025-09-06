#!/usr/bin/env node

/**
 * Test Data Cleanup Script
 * 
 * This script provides instructions for cleaning up test data from localStorage.
 * Since localStorage is browser-only, this script runs in Node.js and provides
 * the necessary commands to run in the browser console.
 */

console.log('🧹 Test Data Cleanup Instructions')
console.log('================================')
console.log('')
console.log('localStorage is browser-only and cannot be accessed from Node.js.')
console.log('To clean up test data, please run the following in your browser console:')
console.log('')
console.log('📋 Copy and paste this command:')
console.log('')
console.log('   localStorage.removeItem("sparc.entries.v1");')
console.log('')
console.log('📍 Where to run this:')
console.log('   1. Open your SPARC Calculator app in the browser')
console.log('   2. Open Developer Tools (F12 or Cmd+Option+I)')
console.log('   3. Go to the Console tab')
console.log('   4. Paste and run the command above')
console.log('')
console.log('✅ Verification:')
console.log('   - The dashboard should show "No entries yet"')
console.log('   - All test entries should be removed')
console.log('')
console.log('🔄 Alternative: Clear all localStorage data')
console.log('   localStorage.clear();')
console.log('')
console.log('⚠️  Note: This will remove ALL localStorage data, not just SPARC entries.')
console.log('')
