# HDR 硬件评审

## 概述 {#overview}

HDR（Hardware Design Review）硬件设计评审是在硬件设计方案定稿后、进入量产前的关键评审环节，用于确保硬件设计的可靠性、可生产性和可维护性。

### 评审目的

- 验证硬件设计的完整性
- 评估生产可行性
- 检查可靠性设计
- 确认测试覆盖率

### 适用范围

HDR 适用于以下场景：

- PCB 设计完成，准备打样
- 工程样机验证通过
- 准备进入小批量试产
- 重大硬件变更后

---

## 评审流程 {#process}

### 1. 设计文档评审

需要提交的设计文档：

| 文档类型 | 内容要求 | 负责人 |
|---------|---------|-------|
| 原理图 | 完整电路设计，含参数标注 | 硬件工程师 |
| PCB 文件 | 布局布线图、Gerber 文件 | 硬件工程师 |
| BOM 清单 | 物料型号、数量、供应商 | 硬件工程师 |
| 结构图纸 | 外壳尺寸、开孔位置 | 结构工程师 |

### 2. 设计规则检查

PCB 设计检查要点：

```
设计规则检查项:
├── 布局检查
│   ├── 元件间距是否满足安规要求
│   ├── 散热设计是否合理
│   ├── 关键器件位置是否优化
│   └── 预留测试点位置
├── 布线检查
│   ├── 电源线宽是否满足载流要求
│   ├── 高速信号走线是否优化
│   ├── 差分信号是否等长匹配
│   └── EMI 设计是否完善
└── 制造检查
    ├── 最小线宽/间距是否满足工艺能力
    ├── 过孔设计是否合理
    ├── 阻焊设计是否规范
    └── 钢网设计是否合理
```

### 3. 可靠性评审

可靠性测试项目：

| 测试项目 | 测试条件 | 验收标准 |
|---------|---------|---------|
| 高温测试 | 85°C, 72h | 功能正常 |
| 低温测试 | -40°C, 72h | 功能正常 |
| 温循测试 | -40~85°C, 10 cycles | 功能正常 |
| 湿热测试 | 85°C/85%RH, 48h | 功能正常 |
| ESD 测试 | 接触±6kV, 空气±8kV | B级以上 |
| 浪涌测试 | 电源线±2kV | 功能正常 |

### 4. 生产评审

生产准备检查：

- [ ] 生产文件是否完整
- [ ] 测试治具是否就绪
- [ ] 生产流程是否确定
- [ ] QC 标准是否制定
- [ ] 包装方案是否确认

---

## 检查清单 {#checklist}

### 原理图检查

- [ ] 电源树是否完整标注
- [ ] 元器件参数是否正确
- [ ] 网络标号是否清晰
- [ ] 是否有设计说明文档
- [ ] 是否有版本记录

### PCB 检查

- [ ] DRC 检查是否通过
- [ ] 层叠设计是否合理
- [ ] 电源分割是否完整
- [ ] 安规间距是否满足
- [ ] 测试点是否充足

### BOM 检查

- [ ] 物料型号是否完整
- [ ] 是否有替代料方案
- [ ] 关键器件是否有多供应商
- [ ] 物料交期是否评估
- [ ] 物料成本是否核算

### 测试检查

- [ ] 测试用例是否覆盖所有功能
- [ ] 测试设备是否校准
- [ ] 测试报告模板是否制定
- [ ] 测试人员是否培训
- [ ] 测试环境是否满足要求

---

## 模板下载 {#templates}

### BOM 清单模板

```
项目名称: XXX
版本: V1.0
日期: 2026-07-21

序号 | 位号        | 型号             | 封装    | 数量 | 品牌   | 供应商 | 单价 | 备注
----|------------|------------------|--------|-----|-------|-------|-----|-----
1   | C1, C2     | GRM188R71H104KA93| 0603   | 2   | Murata| Digikey| 0.1 | 100nF
2   | R1         | RC0603FR-0710KL  | 0603   | 1   | Yageo | LCSC  | 0.01| 10K
...
```

### 结构设计规范

```c
// 接口定位示例
#define USB_CONNECTOR_X      25.0   // USB 接口 X 坐标
#define USB_CONNECTOR_Y      10.0   // USB 接口 Y 坐标
#define LED_POSITION_X       50.0   // LED X 坐标
#define LED_POSITION_Y       5.0    // LED Y 坐标

// 开孔尺寸
#define USB_OPENING_WIDTH    15.0   // USB 开孔宽度
#define USB_OPENING_HEIGHT   8.0    // USB 开孔高度
#define BUTTON_DIAMETER      6.0    // 按钮开孔直径

// 安规间距
#define CLEARANCE_HIGH_VOLTAGE  3.0 // 高压安规间距 (mm)
#define CLEARANCE_LOW_VOLTAGE   0.5 // 低压安规间距 (mm)
```

### 测试代码示例

```c
// 硬件自检程序
#include "hardware_check.h"

typedef struct {
    const char* name;
    bool (*test_func)(void);
    bool result;
} HardwareTest;

static HardwareTest tests[] = {
    {"Power Supply", test_power_supply},
    {"MCU Core",     test_mcu_core},
    {"Flash Memory", test_flash_memory},
    {"SRAM",         test_sram},
    {"GPIO",         test_gpio},
    {"ADC",          test_adc},
    {"UART",         test_uart},
    {"SPI",          test_spi},
    {"I2C",          test_i2c},
};

void run_hardware_tests(void) {
    int passed = 0;
    int total = sizeof(tests) / sizeof(tests[0]);

    printf("\n=== Hardware Self-Test ===\n");

    for (int i = 0; i < total; i++) {
        printf("Testing %s... ", tests[i].name);
        tests[i].result = tests[i].test_func();
        printf("%s\n", tests[i].result ? "PASS" : "FAIL");
        if (tests[i].result) passed++;
    }

    printf("\n=== Result: %d/%d Passed ===\n", passed, total);
}

bool test_power_supply(void) {
    // 检查各路电源电压
    float v3v3 = ADC_ReadVoltage(ADC_CH_3V3);
    float v5v0 = ADC_ReadVoltage(ADC_CH_5V0);

    return (v3v3 >= 3.2f && v3v3 <= 3.4f) &&
           (v5v0 >= 4.9f && v5v0 <= 5.1f);
}
```

---

## 常见问题

### Q1: HDR 和 PDR 有什么区别？

PDR 偏重**功能验证**，确认原型是否实现设计功能；HDR 偏重**生产验证**，确认硬件是否可以量产。

### Q2: 硬件评审失败常见原因？

- 安规间距不足
- BOM 物料停产或交期长
- PCB 工艺要求超出现有产线能力
- 可靠性测试未通过
- 成本超标

### Q3: HDR 通过后多久可以量产？

HDR 通过后还需要：
- 制作工装夹具：1-2 周
- 小批量试产：1-2 周
- 生产验证：1 周
- 问题整改：1-2 周

通常 HDR 通过后 4-6 周可以进入量产。

---

> **提示**: 在 HDR 阶段要特别关注物料选型，避免使用独家供货或即将停产的元器件。