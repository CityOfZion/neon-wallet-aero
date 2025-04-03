module.exports = {
  '**/*.ts?(x)': () => ['npm run lint', 'npm run typecheck'],
}
