sample_data_column = {
    x_axis: {
        values: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    y_axis: {
        values: [0, 100, 200, 300, 400, 500],
        unit: ''
    },
    y_axis_2: {
        values: [0, 20, 40, 60, 80, 100],
        unit: '%'
    },
    series: {
        values: [200, 300, 400, 300, 200, 300, 500],
        values_2: [60, 30, 40, 30, 20, 30, 65],
    }
}

sample_data_bar = {
    x_axis: {
        values: [0, 100, 200, 300, 400, 500],
        unit: ''
    },
    series: {
        items: ['Bar 1', 'Bar 2', 'Bar 3'],
        values: [250, 500, 400],
        values_2: [60, 30, 40],
    }
}

// Function: drawLine
// Usage: To build the frames of the chart.
// Input: canvas_instance, line_width, start_x, start_y, end_x, end_y.
function drawLine(ctx, width, start_x, start_y, end_x, end_y, rgba) {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x, end_y);
    ctx.strokeStyle = rgba;
    ctx.stroke();
}

// Function: drawCircle
function drawCircle(ctx, start_x, start_y, radius, rgba) {
    ctx.beginPath();
    ctx.arc(start_x, start_y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = rgba;
    ctx.fill();
}

// Function: fillText
function fillText(ctx, font, text, x, y) {
    ctx.font = font;
    ctx.fillText(text, x, y);
}

// Function: drawColumn
// Input: canvas_id, canvas_width, canvas_height, rgba_column, rgba_line, data.
function drawColumn(wrap_id, canvas_width, canvas_height, rgba_column, rgba_line, data) {
    let canvas = document.getElementById(wrap_id);
    canvas.width = canvas_width;
    canvas.height = canvas_height;

    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        ctx.width = canvas.width;
        ctx.height = canvas.height;
        ctx.margin = 44.5;

        // X axis
        drawLine(ctx, 1, ctx.margin, ctx.height - ctx.margin, ctx.width - ctx.margin, ctx.height - ctx.margin, "rgba(0, 0, 0, 1)");

        let x_axis_scales = data.x_axis.values.length + 1;
        let x_axis_step = (ctx.width - 2 * ctx.margin) / x_axis_scales;

        for (i = 0; i < x_axis_scales; i++) {
            // Draw scale on X axis
            let scale_x = x_axis_step * i + ctx.margin;
            let scale_y = ctx.height - ctx.margin;
            drawLine(ctx, 1, scale_x, scale_y, scale_x, scale_y - 10, "rgba(0, 0, 0, 1)");
            
            // Fill text on X axis
            if (data.x_axis.values[i - 1] !== undefined) {
                fillText(ctx, "10px serif", data.x_axis.values[i - 1], scale_x, scale_y + ctx.margin / 2);
            }

        }

        // Y axis
        drawLine(ctx, 1, ctx.margin, ctx.height - ctx.margin, ctx.margin, ctx.margin, "rgba(0, 0, 0, 1)");

        let y_axis_scales = data.y_axis.values.length - 1;
        let y_axis_step = (ctx.height - 2 * ctx.margin) / y_axis_scales;

        for (i = 0; i <= y_axis_scales; i++) {
            // Draw scale on Y axis
            let scale_x = ctx.margin;
            let scale_y = ctx.height - ctx.margin - y_axis_step * i;
            drawLine(ctx, 1, scale_x, scale_y, scale_x + ctx.width - 2 * ctx.margin, scale_y, "rgba(0, 0, 0, 0.3)");

            // Fill text on Y axis
            if (data.y_axis.values[i] !== undefined) {
                fillText(ctx, "10px serif", data.y_axis.values[i] + data.y_axis.unit, scale_x - ctx.margin / 2, scale_y)
            }
        }

        // Y axis 2
        drawLine(ctx, 1, ctx.width - ctx.margin, ctx.height - ctx.margin, ctx.width - ctx.margin, ctx.margin, "rgba(0, 0, 0, 0.5)")

        let y_axis_2_scales = data.y_axis_2.values.length - 1;
        let y_axis_2_step = (ctx.height - 2 * ctx.margin) / y_axis_2_scales;

        for (i = 0; i <= y_axis_2_scales; i++) {
            // Draw scale on Y axis 2
            let scale_x_2 = ctx.width - ctx.margin;
            let scale_y_2 = ctx.height - ctx.margin - y_axis_2_step * i;
            drawLine(ctx, 1, scale_x_2, scale_y_2, scale_x_2 - 5, scale_y_2, "rgba(0, 0, 0, 0.5)");

            // Fill text on Y axis 2
            if (data.y_axis_2.values[i] !== undefined) {
                fillText(ctx, "10px serif", data.y_axis_2.values[i] + data.y_axis_2.unit, scale_x_2 + ctx.margin / 5, scale_y_2);
            }
        }

        // Series
        for (i = 0; i < x_axis_scales; i++) {
            let column_x = x_axis_step * i + ctx.margin;
            let column_y = ctx.height - ctx.margin; 
            let column_value = (ctx.height - 2 * ctx.margin) / data.y_axis.values[data.y_axis.values.length - 1] * data.series.values[i]; 

            // Columns
            if (data.series.values[i] !== undefined) {
                ctx.fillStyle = rgba_column;
                ctx.fillRect(column_x - x_axis_step / 3 + x_axis_step, column_y, x_axis_step * 2 / 3, -column_value);
            }

            // Value 2 dots
            if (data.series.values_2[i] !== undefined) {
                let dot_x = column_x + x_axis_step;
                let dot_y = ctx.height - ctx.margin - (ctx.height - 2 * ctx.margin) / data.y_axis_2.values[data.y_axis_2.values.length - 1] * data.series.values_2[i]; 
                drawCircle(ctx, dot_x, dot_y, 5, rgba_line);

                // Value 2 trend line
                if (data.series.values_2[i + 1] !== undefined) {
                    let dot_x_next = column_x + 2 * x_axis_step;
                    let dot_y_next = ctx.height - ctx.margin - (ctx.height - 2 * ctx.margin) / data.y_axis_2.values[data.y_axis_2.values.length - 1] * data.series.values_2[i + 1]; 
                    drawLine(ctx, 2, dot_x, dot_y, dot_x_next, dot_y_next, rgba_line);
                }
            }
        }
        
    }
}

// Function: drawBar
// Input: canvas_id, canvas_width, canvas_height, rgba_bar_1, rgba_bar_2, data.
function drawBar(wrap_id, canvas_width, canvas_height, rgba_bar_1, rgba_bar_2, data) {
    let canvas = document.getElementById(wrap_id);
    canvas.width = canvas_width;
    canvas.height = canvas_height;

    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        ctx.width = canvas.width;
        ctx.height = canvas.height;
        ctx.margin = 44.5;

        // X axis
        drawLine(ctx, 1, ctx.margin, ctx.height - ctx.margin, ctx.width - ctx.margin, ctx.height - ctx.margin, "rgba(0, 0, 0, 1)");

        let x_axis_scales = data.x_axis.values.length - 1;
        let x_axis_step = (ctx.width - 2 * ctx.margin) / x_axis_scales;

        for (i = 0; i <= x_axis_scales; i++) {
            // Draw scale on X axis
            let scale_x = x_axis_step * i + ctx.margin;
            let scale_y = ctx.height - ctx.margin;
            drawLine(ctx, 1, scale_x, scale_y, scale_x, ctx.margin, "rgba(0, 0, 0, 0.3)");
            
            // Fill text on X axis
            if (data.x_axis.values[i] !== undefined) {
                fillText(ctx, "10px serif", data.x_axis.values[i], scale_x, scale_y + ctx.margin / 2);
            }

        }

        // Y axis
        drawLine(ctx, 1, ctx.margin, ctx.height - ctx.margin, ctx.margin, ctx.margin, "rgba(0, 0, 0, 1)")

        let y_axis_scales = data.series.items.length + 1;
        let y_axis_step = (ctx.height - 2 * ctx.margin) / y_axis_scales;

        for (i = 0; i < y_axis_scales; i++) {
            // Draw scale on Y axis
            let scale_x = ctx.margin;
            let scale_y = ctx.height - ctx.margin - y_axis_step * i;
            drawLine(ctx, 1, scale_x, scale_y, ctx.margin + 5, scale_y, "rgba(0, 0, 0, 1)");

            // Fill text on Y axis
            if (data.series.items[i - 1] !== undefined) {
                fillText(ctx, "10px serif", data.series.items[i - 1], scale_x - ctx.margin / 2, scale_y);
            }
        }

        // Series
        for (i = 0; i < y_axis_scales; i++) {
            let bar_x = ctx.margin;
            let bar_y = ctx.height - ctx.margin - y_axis_step * (i + 1);
            console.log('data.x_axis.values[data.x_axis.values.length - 1]: ', data.x_axis.values[data.x_axis.values.length - 1]);
            console.log(' data.series.values[i]: ',  data.series.values[i]);
            let bar_value = (ctx.width - 2 * ctx.margin) / data.x_axis.values[data.x_axis.values.length - 1] * data.series.values[i] + ctx.margin; 
        

            // Bars
            if (data.series.values[i] !== undefined) {
                drawLine(ctx, 30, bar_x, bar_y, bar_value, bar_y, rgba_bar_1); 
            }
        }
    }
}

drawColumn('wrap_column', 600, 300, "rgba(66, 135, 245, 0.8)", "rgba(0, 160, 0, 1)", sample_data_column);

drawBar('wrap_bar', 600, 300, "rgba(66, 135, 245, 0.8)", "rgba(0, 160, 0, 1)", sample_data_bar);