var moveup = function (index, row, rows) {
  if (index > 0) {
    let upRow = rows[index - 1]
    rows.splice(index - 1, 1);
    rows.splice(index,0, upRow);
  }
}

var movedown = function (index, row, rows) {
  if ((index + 1) != rows.length) {
    let downRow = rows[index + 1]
    rows.splice(index + 1, 1);
    rows.splice(index, 0, downRow);
  }
}

export {
  moveup, movedown
}
