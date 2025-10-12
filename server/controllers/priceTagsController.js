const {DeviceOptions, Device, Brand, PriceTags} = require("../models/models");
const ExcelJS = require("exceljs");
const apiError = require("../error/apierror");
const {Op} = require("sequelize");

class priceTagsController {

    async getAllPriceTags(req, res, next) {
        try {
            const {offset,type} = req.query;

            const tags = await PriceTags.findAll({
                limit: 500,
                offset: +offset,
                where:type?{type}:{},
                order: [['createdAt', "DESC"]],
                include: [{
                    model: DeviceOptions,
                    attributes: ['optionName','price','saleprice'],
                    include: [{
                        model: Device,
                        attributes: ['name','series']
                    }],
                }]
            })
            res.json(tags)
        } catch (err) {
            next(apiError.badRequest(`error: ${err.message}`));
        }
    }


    async printingExcelTags(req, res, next) {
        try {
            const {ids} = req.body;

            if(!ids || ids.length < 1) {
                return next(apiError.badRequest(`Оберіть хоча б 1 цінник`));
            }


            const tags = await PriceTags.findAll({
                where: {id:{[Op.in]:ids}},
                order: [['createdAt', "DESC"]],
                include: [{
                    model: DeviceOptions,
                    attributes: ['optionName','price','saleprice'],
                    include: [{
                        model: Device,
                        attributes: ['name','series'],
                        include: [{
                            attributes: ['name'],
                            model: Brand
                        }],
                    }],
                }]
            })
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Нові цінники');
            const columnWidths = [4.72, 3.9, 2.6, 10.6];
            const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
            const columns = [];
            for (let i = 0; i < 16; i++) {
                columns.push({
                    key: columnLetters[i],
                    width: columnWidths[i % 4]
                });
            }
            worksheet.columns = columns;

            let row = 1;
            let col = 1;
            const row1 = worksheet.getRow(row);
            row1.height = 25.75;
            const row2 = worksheet.getRow(row + 1);
            row2.height = 20;
            const row3 = worksheet.getRow(row + 2);
            row3.height = 30;
            const row4 = worksheet.getRow(row + 3);
            row4.height = 12;


            for (let i = 0; i < tags.length; i++) {

                const name = `${tags[i].deviceoption.device.name} ${tags[i].deviceoption.optionName}`;
                const series = tags[i].deviceoption.device.series;
                worksheet.mergeCells(`${columnLetters[col - 1]}${row}:${columnLetters[col + 2]}${row}`);
                worksheet.mergeCells(`${columnLetters[col - 1]}${row + 1}:${columnLetters[col + 2]}${row + 1}`);
                worksheet.mergeCells(`${columnLetters[col]}${row + 2}:${columnLetters[col + 2]}${row + 2}`);
                worksheet.mergeCells(`${columnLetters[col - 1]}${row + 3}:${columnLetters[col]}${row + 3}`);
                worksheet.mergeCells(`${columnLetters[col + 1]}${row + 3}:${columnLetters[col + 2]}${row + 3}`);
                worksheet.getCell(`${columnLetters[col - 1]}${row}`).value = name;
                worksheet.getCell(`${columnLetters[col - 1]}${row + 1}`).value = series;
                worksheet.getCell(`${columnLetters[col - 1]}${row + 2}`).value = 'ціна:';
                worksheet.getCell(`${columnLetters[col]}${row + 2}`).value = `${tags[i].deviceoption.price} грн`;

                worksheet.getCell(`${columnLetters[col - 1]}${row + 3}`).value = 'Lamiya.com.ua';
                worksheet.getCell(`${columnLetters[col + 1]}${row + 3}`).value = 'ФОП Фасто Я.М';
                worksheet.getCell(`${columnLetters[col - 1]}${row}`).alignment = {
                    wrapText: true,
                    horizontal: 'left',
                    vertical: 'top'
                };
                worksheet.getCell(`${columnLetters[col - 1]}${row}`).font = {
                    name: 'Arial',
                    size: name.length > 60 ? 6 : 7,
                };
                worksheet.getCell(`${columnLetters[col - 1]}${row + 1}`).alignment = {
                    wrapText: true,
                    horizontal: 'left',
                    vertical: 'middle'
                };
                worksheet.getCell(`${columnLetters[col - 1]}${row + 1}`).font = {
                    name: 'Arial',
                    size: 7,
                };
                worksheet.getCell(`${columnLetters[col - 1]}${row + 2}`).alignment = {
                    horizontal: 'right',
                    vertical: 'middle'
                };
                worksheet.getCell(`${columnLetters[col - 1]}${row + 2}`).font = {
                    name: 'Arial',
                    size: 10
                };
                worksheet.getCell(`${columnLetters[col]}${row + 2}`).alignment = {
                    horizontal: 'left',
                    vertical: 'middle'
                };
                worksheet.getCell(`${columnLetters[col]}${row + 2}`).font = {
                    name: 'Arial',
                    size: 18,
                    bold: true
                };
                worksheet.getCell(`${columnLetters[col - 1]}${row + 3}`).alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                };
                worksheet.getCell(`${columnLetters[col - 1]}${row + 3}`).font = {
                    name: 'Arial',
                    size: 6,
                    bold: true
                };
                worksheet.getCell(`${columnLetters[col + 1]}${row + 3}`).alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                };
                worksheet.getCell(`${columnLetters[col + 1]}${row + 3}`).font = {
                    name: 'Arial',
                    size: 6
                };

                worksheet.getCell(`${columnLetters[col + 2]}${row}`).border = {
                    right: {
                        style: 'thin',
                        color: {argb: 'FF000000'}
                    }
                };
                worksheet.getCell(`${columnLetters[col + 2]}${row + 1}`).border = {
                    right: {
                        style: 'thin',
                        color: {argb: 'FF000000'}
                    }
                };
                worksheet.getCell(`${columnLetters[col + 2]}${row + 2}`).border = {
                    right: {
                        style: 'thin',
                        color: {argb: 'FF000000'}
                    }
                };

                worksheet.getCell(`${columnLetters[col - 1]}${row + 3}`).border = {
                    bottom: {
                        style: 'thin',
                        color: {argb: 'FF000000'}
                    }
                };
                worksheet.getCell(`${columnLetters[col]}${row + 3}`).border = {
                    bottom: {
                        style: 'thin',
                        color: {argb: 'FF000000'}
                    }
                };
                worksheet.getCell(`${columnLetters[col + 1]}${row + 3}`).border = {
                    bottom: {
                        style: 'thin',
                        color: {argb: 'FF000000'}
                    }
                };
                worksheet.getCell(`${columnLetters[col + 2]}${row + 3}`).border = {
                    bottom: {style: 'thin', color: {argb: 'FF000000'}},
                    right: {style: 'thin', color: {argb: 'FF000000'}}
                };

                if (i % 4 === 3) {
                    col = 1;
                    row += 4;
                    const row1 = worksheet.getRow(row);
                    row1.height = 25.75;
                    const row2 = worksheet.getRow(row + 1);
                    row2.height = 20;
                    const row3 = worksheet.getRow(row + 2);
                    row3.height = 30;
                    const row4 = worksheet.getRow(row + 3);
                    row4.height = 12;
                } else {
                    col += 4;
                }
            }


            // Генеруємо буфер
            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Disposition', 'attachment; filename="generated.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            await PriceTags.destroy({where: {id:{[Op.in]:ids}}})
            return res.send(buffer);
        } catch (err) {
            next(apiError.badRequest(`error: ${err.message}`));
        }
    }

}

module.exports = new priceTagsController();