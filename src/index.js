const explode = require("@babel/helper-explode-assignable-expression").default;
const t = require("@babel/types");

const operator = '**';
const getMathPowExpression = (left, right) => {
  return t.callExpression(
    t.memberExpression(t.identifier("Math"), t.identifier("pow")),
    [left, right],
  );
}

module.exports = function() {
  return {
    name: 'babel-plugin-exponentiation-operator',
    visitor: {
      AssignmentExpression(path) {
        const { node, scope } = path;
        // 只处理 **=
        if (node.operator === `${operator}=`) {
          const nodes = [];
          // 找一个不会炸掉的变量名
          const exploded = explode(node.left, nodes, this, scope);
          nodes.push(
            t.assignmentExpression(
              "=",
              exploded.ref,
              getMathPowExpression(exploded.uid, node.right),
            ),
          );
          console.log(JSON.parse(JSON.stringify(nodes)))
          path.replaceWithMultiple(nodes);
        }
      },

      BinaryExpression(path) {
        const { node } = path;
        if (node.operator === operator) {
          path.replaceWith(getMathPowExpression(node.left, node.right));
        }
      },
    }
  };
}
