const t = require('@babel/types')

const getMathPowExpression = (left, right) => {
  return t.callExpression(
    t.memberExpression(t.identifier("Math"), t.identifier("pow")),
    [left, right],
  );
}


module.exports = function () {
  return {
    name: 'babel-plugin-exponentiation-operatorrain',
    visitor: {
      BinaryExpression (path) {
        console.log(path)
        const { node  } = path
        if (node.operator === '**') {
          path.replaceWith(getMathPowExpression(node.left, node.right));
        }
      }
    }
  }
}