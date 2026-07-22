# MDR 设计评审

## 概述 {#overview}

MDR（Market Design Review）市场需求设计评审是单片机开发流程中的关键环节，用于确保产品设计方向符合市场需求和用户期望。

### 评审目的

- 验证产品定义的完整性和准确性
- 评估市场需求的可行性
- 识别潜在的技术风险和挑战
- 确保开发团队对需求理解一致

### 适用范围

MDR 适用于以下场景：

- 新产品立项阶段
- 重大功能变更时
- 产品迭代升级前
- 客户定制需求确认

---

## 评审流程 {#process}

### 1. 评审准备

评审前需要准备以下材料：

| 文档类型 | 内容要求 | 负责人 |
|---------|---------|-------|
| 市场需求文档 | 详细描述目标用户、使用场景、功能需求 | 产品经理 |
| 技术方案初稿 | 硬件选型、软件架构初步构想 | 技术负责人 |
| 成本预算 | BOM 预估成本、开发周期评估 | 项目经理 |
| 竞品分析 | 市场同类产品对比分析 | 市场人员 |

### 2. 评审会议

评审会议流程：

1. **需求讲解**（15分钟）
   - 产品经理讲解需求背景和核心功能

2. **技术讨论**（30分钟）
   - 技术方案可行性分析
   - 风险点识别和应对策略

3. **评审表决**（10分钟）
   - 评审委员会投票决定是否通过

4. **问题记录**（5分钟）
   - 记录待解决问题和改进建议

### 3. 评审结论

评审结果分为三种：

- **通过**：需求明确，技术方案可行，可以进入下一阶段
- **有条件通过**：需补充材料或修改方案，条件满足后可进入下一阶段
- **不通过**：需求不清晰或技术方案不可行，需重新评估

---

## 检查清单 {#checklist}

### 需求完整性检查

- [ ] 目标用户群体是否明确定义
- [ ] 产品使用场景是否描述清楚
- [ ] 功能需求是否有优先级排序
- [ ] 性能指标是否有量化标准
- [ ] 接口需求是否列出

### 技术可行性检查

- [ ] MCU 选型是否满足性能要求
- [ ] 电源方案是否满足功耗指标
- [ ] 外设接口是否充足
- [ ] 软件架构是否合理
- [ ] 开发周期是否可接受

### 成本和风险评估

- [ ] BOM 成本是否在预算范围
- [ ] 关键器件是否有替代方案
- [ ] 供应链风险是否评估
- [ ] 技术难点是否有解决方案
- [ ] 测试方案是否完整

---

## 模板下载 {#templates}

### 评审文档模板

- [MDR 评审申请表](/templates/mdr-application.docx)
- [市场需求文档模板](/templates/market-requirement.docx)
- [技术方案模板](/templates/technical-proposal.docx)

### 代码示例

```c
// MCU 初始化配置示例
#include "stm32f4xx_hal.h"

void SystemClock_Config(void) {
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

    // 配置主 PLL
    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
    RCC_OscInitStruct.HSEState = RCC_HSE_ON;
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
    RCC_OscInitStruct.PLL.PLLM = 8;
    RCC_OscInitStruct.PLL.PLLN = 336;
    RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2;
    RCC_OscInitStruct.PLL.PLLQ = 7;

    if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK) {
        Error_Handler();
    }

    // 配置系统时钟
    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                                  |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV4;
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV2;

    if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_5) != HAL_OK) {
        Error_Handler();
    }
}
```

---

## 常见问题

### Q1: MDR 和 PDR 有什么区别？

MDR 侧重于**市场需求**层面的评审，关注产品是否满足用户需求；PDR 侧重于**原型实现**层面的评审，关注功能原型是否正确实现了设计规格。

### Q2: 评审不通过怎么办？

评审不通过时，需要：
1. 分析不通过的具体原因
2. 补充或修改相关材料
3. 重新提交评审申请
4. 进行二次评审

### Q3: 多久进行一次 MDR？

通常在以下时机进行 MDR：
- 新项目立项时（必须）
- 重大需求变更时（必须）
- 季度产品规划评审时（可选）

---

> **提示**: 建议在 MDR 阶段投入足够的时间进行需求澄清，避免后期返工成本。