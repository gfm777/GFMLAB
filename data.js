/* ============================================
   MIXLAB 混音知识库数据
   包含: 术语库 / 运作逻辑 / 历史时间线
   ============================================ */

const CATEGORY_MAP = {
    effects: { label: '效果器', color: 'cyan' },
    processing: { label: '信号处理', color: 'purple' },
    spatial: { label: '空间定位', color: 'green' },
    dynamics: { label: '动态控制', color: 'yellow' },
    tonal: { label: '音色塑造', color: 'magenta' }
};

const TERMINOLOGY_DATA = [
    /* === 动态控制 === */
    {
        id: 'compressor',
        name: '压缩器',
        nameEn: 'Compressor',
        category: 'dynamics',
        icon: '🎚️',
        letter: 'Y',
        shortDesc: '通过降低超出阈值的音频信号电平，缩小动态范围，让声音更紧凑、更有冲击力。',
        description: '压缩器是混音中最核心的动态处理器之一。它的工作原理是检测输入信号的电平，当信号超过设定的阈值（Threshold）时，按照设定的压缩比（Ratio）对超过部分进行衰减。压缩可以让声音更稳定、更靠前，同时增加音色的密度和质感。',
        principles: [
            '阈值（Threshold）：决定开始压缩的电平点，单位为 dB',
            '压缩比（Ratio）：信号超过阈值后，输入与输出的比例，如 4:1 表示超过4dB只输出1dB',
            '启动时间（Attack）：信号超过阈值后，压缩器开始工作的时间，单位 ms',
            '释放时间（Release）：信号回落到阈值以下后，压缩停止的时间，单位 ms',
            'Knee（拐点）：控制阈值处压缩过渡的平滑程度，Hard Knee 突然，Soft Knee 柔和',
            'Make-up Gain（补偿增益）：补偿压缩造成的整体电平损失'
        ],
        params: [
            { name: 'Threshold', range: '-60dB ~ 0dB', desc: '触发压缩的电平阈值，越低压缩越多' },
            { name: 'Ratio', range: '1:1 ~ ∞:1', desc: '压缩强度，∞:1 称为限制器(Limiter)' },
            { name: 'Attack', range: '0.1ms ~ 500ms', desc: '压缩启动快慢，快攻击保留瞬态少' },
            { name: 'Release', range: '10ms ~ 5s', desc: '压缩释放快慢，影响动态感和自然度' }
        ],
        types: [
            'VCA 压缩器：电压控制放大器，速度快、精准，适合鼓组和混音总线',
            'FET 压缩器：场效应管，音色温暖带失真，适合人声和贝斯',
            'Optical 压缩器：光电管，响应平滑自然，适合人声和声学乐器',
            'Variable-Mu 压缩器：电子管，音色饱满肥厚，适合母带处理'
        ],
        tips: [
            '人声建议 Attack 10-30ms，Release 100-300ms，Ratio 2:1~4:1',
            '鼓组建议更快的 Attack 来控制瞬态，但不要完全掐掉打击感',
            '使用压缩时尽量配合峰值表和增益衰减表观察效果',
            '并行压缩（New York 压缩）是增强鼓声冲击力的经典技巧'
        ]
    },
    {
        id: 'limiter',
        name: '限制器',
        nameEn: 'Limiter',
        category: 'dynamics',
        icon: '🛡️',
        letter: 'X',
        shortDesc: '极端的压缩器（Ratio ∞:1），确保信号不超过指定上限，防止削波失真。',
        description: '限制器可以看作是压缩比无穷大的压缩器，它强制信号电平不超过设定的上限（Ceiling），是防止削波和提升响度的终极工具。在母带处理中，限制器是最后一道关卡。',
        principles: [
            'Look-ahead（提前预测）：现代限制器会提前读取信号，确保瞬态不会削波',
            'Ceiling（天花板）：输出信号的最大电平上限，通常设为 -0.3 dB 或 -1 dBTP',
            '输入增益（Input Gain）：推动信号进入限制的程度，越多限制越重',
            '软削波（Soft Clipping）：部分限制器在极限位加入饱和而非硬削波'
        ],
        params: [
            { name: 'Ceiling', range: '-3dB ~ 0dB', desc: '输出上限，母带常用 -0.3dB' },
            { name: 'Input Gain', range: '0 ~ +12dB', desc: '推动限制的强度' },
            { name: 'Release', range: 'Auto / 10ms~2s', desc: '释放速度，通常自动模式最稳妥' }
        ],
        tips: [
            '母带限制器的增益衰减尽量不要超过 3-6 dB，否则会牺牲动态',
            '真峰值（True Peak）限制器可以防止数模转换后的超采样削波',
            '响度不是越高越好，保留动态才能让音乐有呼吸感'
        ]
    },
    {
        id: 'gate',
        name: '噪声门',
        nameEn: 'Noise Gate / Expander',
        category: 'dynamics',
        icon: '🚪',
        letter: 'Z',
        shortDesc: '电平低于阈值时切断/衰减信号，消除串音和底噪，常用于鼓组分轨。',
        description: '噪声门是压缩器的反向操作——当信号低于阈值时，它不通过（或衰减）信号。可以有效去除鼓组中不希望出现的串音、环境噪音和底噪。扩展器（Expander）则是低于阈值时按比例衰减，更自然。',
        principles: [
            '阈值（Threshold）：低于此电平的信号被门限切断或衰减',
            '范围（Range）：门关闭时衰减的量，-60dB 近似完全切断',
            'Attack/Release：控制门开关的快慢，影响声音的起音和尾巴',
            '侧链触发（Sidechain Trigger）：可用另一轨信号来控制门的开关'
        ],
        params: [
            { name: 'Threshold', range: '-80 ~ -20dB', desc: '开门的电平门槛' },
            { name: 'Range', range: '-∞ ~ 0dB', desc: '门关到底时衰减多少' },
            { name: 'Hold', range: '0 ~ 1s', desc: '开门后最少保持多久才关' }
        ],
        tips: [
            '对军鼓使用侧链门，让底鼓触发军鼓保持打开，得到更紧凑的鼓组',
            'Gate 的 Hold 时间太短会导致门开关颤抖（Chatter）'
        ]
    },
    {
        id: 'deesser',
        name: '齿音消除器',
        nameEn: 'De-Esser',
        category: 'dynamics',
        icon: '👄',
        letter: 'C',
        shortDesc: '专门针对人声中 S/Z/Sh 等高频刺耳齿音的频率选择性压缩器。',
        description: 'De-Esser 是一种只在特定频段（通常 4kHz-10kHz）起作用的压缩器。当人声经过均衡和压缩后，"嘶、嘶"的齿音往往变得过于突出，De-Esser 可以精准地只压缩这些刺耳频段而不影响整体音色。',
        principles: [
            '频段检测：只对指定频率范围内的电平进行检测',
            '压缩方式：分为宽频压缩和分频压缩两种',
            'Sibilance（咝声量）：控制减少齿音的程度'
        ],
        params: [
            { name: 'Frequency', range: '4kHz ~ 10kHz', desc: '目标齿音频段，男声偏低，女声偏高' },
            { name: 'Threshold', range: '-40 ~ -10dB', desc: '触发衰减的电平' },
            { name: 'Amount', range: '0 ~ -20dB', desc: '最大衰减量' }
        ],
        tips: [
            '处理前先 Solo 并反复 A/B，避免把齿音消得让人声发闷',
            'EQ 提升高频后齿音通常会更突出，De-Esser 建议放在 EQ 之后'
        ]
    },
    /* === 音色塑造 === */
    {
        id: 'eq',
        name: '均衡器',
        nameEn: 'Equalizer (EQ)',
        category: 'tonal',
        icon: '📊',
        letter: 'J',
        shortDesc: '按频率调整音量的工具，用于修正音色缺陷、分离乐器、塑造声音性格。',
        description: '均衡器（EQ）是混音中最基础也是最重要的工具之一。它允许你独立地提升或削减声音中不同频率段的电平。正确使用 EQ 可以让每样乐器在频谱中找到自己的位置，避免互相遮掩，让整个混音清澈而有力。',
        principles: [
            '频谱划分：通常分为低频（<250Hz）、中低频（250Hz-2kHz）、中高频（2kHz-8kHz）、高频（>8kHz）',
            'Q值（带宽）：决定均衡作用频段的宽窄，Q越窄越精准，Q越宽越自然',
            'Cut 优先原则：优先削减多余频率而不是提升缺失频率，可避免相位问题和增益叠加',
            '加性 EQ vs 减性 EQ：提升会增加相位偏移，削减通常更干净'
        ],
        params: [
            { name: 'Frequency', range: '20Hz ~ 20kHz', desc: '目标频率点或频段中心' },
            { name: 'Gain', range: '-24dB ~ +24dB', desc: '提升或削减的量' },
            { name: 'Q / Bandwidth', range: '0.1 ~ 20', desc: '带宽，Q值越大越窄' }
        ],
        types: [
            'Parametric EQ（参数均衡）：频率/Gain/Q 均可调，最灵活',
            'Graphic EQ（图示均衡）：固定频段滑动推子，适合现场',
            'Shelf EQ（搁架式）：某频率以上/以下全部提升或削减',
            'Passive EQ（无源 EQ）：使用电感电容，音色温暖但有损耗',
            'Pultec EQ：传奇被动EQ，经典的低频提升+高频削减组合'
        ],
        tips: [
            '先用减性EQ消除浑浊（200-300Hz）、箱声（250-600Hz）、刺耳（2-4kHz）',
            '提升前先Q值很窄地扫频，找到问题频率再切',
            '不要在每一条轨都切80Hz以下，要留贝斯和底鼓的空间',
            '高频提升要适度，过度会导致不耐听和数字感'
        ]
    },
    {
        id: 'saturation',
        name: '饱和/失真',
        nameEn: 'Saturation / Distortion',
        category: 'tonal',
        icon: '🔥',
        letter: 'B',
        shortDesc: '模拟磁带、电子管、晶体管的非线性特性，增加谐波、温暖感和质感。',
        description: '饱和是数字混音中重现模拟设备温暖感的核心手段。当信号经过电子管、磁带或晶体管时，会产生软削波并增加偶次/奇次谐波，让声音更厚实、更有"质感"（Grit），并在低音量下也显得更响。',
        principles: [
            '谐波生成：偶次谐波听起来温暖悦耳，奇次谐波更有冲击力和粗糙感',
            '驱动（Drive）：输入信号推得越大，饱和越重',
            '软削波 vs 硬削波：模拟设备是软削波（圆润），数字削波是硬削波（刺耳）',
            'Headroom（动态余量）：留足空间，饱和不会突然产生数字削波'
        ],
        types: [
            'Tape Saturation（磁带饱和）：温暖、低频肥厚、高频圆润，经典Studer A800',
            'Tube Saturation（电子管饱和）：偶次谐波丰富，甜美人声和吉他',
            'Transistor Saturation（晶体管饱和）：更硬、更有冲击力，适合鼓和贝斯',
            'Clipper（削波器）：更极端的饱和，用于增加打击感'
        ],
        tips: [
            '每条轨加一点点饱和，总和起来混音会非常有"模拟味"',
            'Bus 上的轻微磁带饱和是让整个混音融合的魔法',
            '注意控制输入和输出电平，避免过度饱和导致浑浊'
        ]
    },
    /* === 效果器 === */
    {
        id: 'reverb',
        name: '混响',
        nameEn: 'Reverberation (Reverb)',
        category: 'effects',
        icon: '🏛️',
        letter: 'H',
        shortDesc: '模拟声波在空间中反射产生的环境效果，赋予声音空间感、深度和融合感。',
        description: '混响是声音在一个封闭空间中不断反射、逐渐衰减的现象。当你在浴室、大教堂、音乐厅里说话时听到的回声感就是混响。通过混响效果器，我们可以把干巴巴的录音放置在不同的虚拟空间中，让不同的乐器听起来像在同一个房间里演奏。',
        principles: [
            '早期反射（Early Reflections）：声音发出后最早到达的几次墙面反射，决定空间的"大小感"',
            '尾音（Decay / Tail）：反射逐渐衰减的过程，Reverb Time（RT60）是衰减 60dB 所需时间',
            '预延迟（Pre-Delay）：直达声和第一个早期反射之间的时间差，越大空间感越强、人声越靠前',
            '干湿比（Dry/Wet）：原始信号与混响信号的比例，越多Wet越靠后、越有空间感'
        ],
        params: [
            { name: 'Decay Time', range: '0.1s ~ 10s+', desc: '混响衰减时间，小房间短大厅长' },
            { name: 'Pre-Delay', range: '0 ~ 200ms', desc: '混响启动前的延迟，保持清晰度' },
            { name: 'Size / Room', range: 'Small → Large', desc: '虚拟空间的尺寸' },
            { name: 'Damping', range: 'Low → High', desc: '高频吸收量，越大混响越暗' }
        ],
        types: [
            'Hall（大厅）：大空间、长混响，适合古典、电影配乐',
            'Room（房间）：小空间、自然真实，适合流行和摇滚',
            'Plate（板式）：人工金属板混响，密度高、音色华丽，经典人声混响',
            'Spring（弹簧）：复古弹簧混响，Dub、Surf Rock 招牌声',
            'Chamber（密室）：中等大小房间，温暖有凝聚力',
            'Convolution Reverb（卷积混响）：采样真实空间脉冲响应，最逼真'
        ],
        tips: [
            '通过发送轨（Send/Return）使用混响，可以让多轨共享同一个空间',
            '人声 Pre-Delay 20-40ms 可以同时保留清晰度和空间感',
            '在混响上加 EQ，切掉 200Hz 以下和过量 10kHz 以上，防止浑浊和刺耳',
            '侧链压缩让混响在底鼓发声时 duck，保持低频清晰'
        ]
    },
    {
        id: 'delay',
        name: '延迟',
        nameEn: 'Delay',
        category: 'effects',
        icon: '⏱️',
        letter: 'Y',
        shortDesc: '将信号按固定时间重复播放的效果，创造节奏感、空间感和层次。',
        description: '延迟（Delay）是最古老的音频效果之一，原理简单却能变化万千。它将输入信号记录下来，在指定时间后再次播放，可选加入反馈让回声越来越弱。从微妙的双追踪（Doubling）到强烈的 Dub 回声，Delay 是让混音"活"起来的秘密武器。',
        principles: [
            '延迟时间（Delay Time）：每次重复之间的时间间隔，单位 ms 或音符节拍',
            '反馈（Feedback）：重复信号再被送入输入端的比例，决定回声的次数',
            '立体声偏移（Stereo Offset）：LR 通道不同的延迟时间，创造宽度感',
            'Dotted / Triplet：附点和三连音节奏，增加律动性'
        ],
        params: [
            { name: 'Time', range: '1ms ~ 5s', desc: '延迟时间，可同步 DAW 节拍' },
            { name: 'Feedback', range: '0 ~ 95%', desc: '回声循环次数，过高会爆音' },
            { name: 'Tone / Filter', range: 'Dark → Bright', desc: '对每次重复加的滤波' }
        ],
        types: [
            'Tape Delay（磁带延迟）：温暖、每次重复略有音高漂移，经典 Space Echo',
            'Digital Delay（数字延迟）：干净精准，时间精确到毫秒',
            'Analog Delay（模拟延迟）：BBD 芯片，温暖带点脏，Electro-Harmonix',
            'Slapback Delay：10-50ms 单次延迟，50s Rockabilly 招牌',
            'Ping-Pong Delay：左右声道交替延迟，立体感强',
            'Doubling / ADT：30-60ms 短延迟，让单轨人声听起来像双轨'
        ],
        tips: [
            '把 Delay 时间和歌曲 BPM 同步（1/4、1/8、1/16 音符），会听起来更贴合',
            '在反馈回路里加高通滤波，防止重复越来越浑浊',
            '侧链压缩让 Delay 在主唱下一句开始时自动消失'
        ]
    },
    {
        id: 'chorus',
        name: '合唱',
        nameEn: 'Chorus',
        category: 'effects',
        icon: '🎶',
        letter: 'H',
        shortDesc: '通过带调制的短延迟让单音轨听起来像多人/多乐器同时演奏，增加宽度和厚度。',
        description: '合唱效果利用多个略微失谐和延迟不同的相同信号，模拟真人"合唱"时自然存在的微小差异。它让单薄的电吉他、合成器 Pad、人声更宽厚、更有立体声宽度。',
        principles: [
            '调制的短延迟：LFO 调制延迟时间，产生周期性的厚度变化',
            '细微音高漂移：模拟真人演唱/演奏不可能完全同 pitch 的自然感'
        ],
        params: [
            { name: 'Rate', range: '0.1 ~ 10Hz', desc: 'LFO 调制速度' },
            { name: 'Depth', range: '0 ~ 100%', desc: '调制幅度，越大越"晃"' }
        ],
        tips: [
            '合唱加在立体声吉他或 Pad 上，能立刻获得梦幻的宽度',
            '不要加太多，否则会让声音失去焦点'
        ]
    },
    {
        id: 'flanger',
        name: '镶边',
        nameEn: 'Flanger',
        category: 'effects',
        icon: '🌀',
        letter: 'X',
        shortDesc: '极短延迟 + 反馈的调制效果，产生独特的"扫频""飞机掠过"的科幻感音色。',
        description: 'Flanger 的原理类似合唱，但延迟时间更短（1-10ms）且带有反馈。两个相同信号的短延迟差会产生梳状滤波（Comb Filtering）效应，当延迟时间被 LFO 调制时，那些峰谷就会上下移动，产生标志性的"嗖——"的声音。',
        tips: [
            '80 年代摇滚吉他的标志性效果',
            '偶尔点缀即可，不宜整首歌挂着'
        ]
    },
    {
        id: 'phaser',
        name: '相位器',
        nameEn: 'Phaser',
        category: 'effects',
        icon: '🌊',
        letter: 'X',
        shortDesc: '通过全通滤波器移动相位，干湿混合产生一系列移动的陷波，梦幻流动的音色。',
        description: 'Phaser 使用一系列全通滤波器（不改变振幅但改变相位），把原信号和经过相位偏移的信号混合。当两个同频反相信号相遇时会互相抵消，产生一系列随时间移动的"陷波"点，音色比 Flanger 更柔和、更梦幻。'
    },
    /* === 空间定位 === */
    {
        id: 'panning',
        name: '声像定位',
        nameEn: 'Panning',
        category: 'spatial',
        icon: '↔️',
        letter: 'S',
        shortDesc: '在立体声场中左右分配信号，构建混音的横向空间层次，避免乐器冲突。',
        description: '声像（Panorama / Pan）让你把一个单声道音源放置在左、中、右之间的任意位置。合理的声像排布能让每样乐器"各归其位"，听众的左右耳都能清晰分辨不同乐器，混音因此显得"宽"而不"乱"。',
        principles: [
            'Pan Law（声像法则）：中心位置信号相比两侧有 +3dB 或 +6dB 提升补偿',
            'LCR 原则：Lead Vocal、Kick、Bass、Snare 放中间，其他乐器可大胆左右铺开',
            '立体声场：立体声越宽的乐器越不应该放在中心，否则占用宝贵的中间带宽'
        ],
        techniques: [
            'LCR Panning：只使用 L、C、R 三个极端位置，清晰度最高',
            '立体声加倍（Double Tracking）：左右各录一遍同样的吉他/人声，分开 pan',
            'Haas 技巧：把同一信号复制一轨，延迟 5-20ms 并 pan 到另一边，假立体声',
            '频率相关 Panning：低频信息保持中心，高频可拉开'
        ],
        tips: [
            '底鼓、贝斯、主唱、军鼓几乎永远放中心',
            'Hi-Hat 和 Crash 可以大胆 Pan 到 L40-R40 之间',
            '检查单声道兼容性！有些 Pan 技巧在单声道下会相位抵消'
        ]
    },
    {
        id: 'stereo-width',
        name: '立体声宽度',
        nameEn: 'Stereo Width / Imaging',
        category: 'spatial',
        icon: '📐',
        letter: 'L',
        shortDesc: '通过 Mid/Side 处理控制侧信号比例，让混音更宽广或更聚焦。',
        description: '立体声宽度处理利用 Mid/Side 编码：Mid（M）= L+R（单声道成分），Side（S）= L-R（左右差异成分）。提升 Side 信号可以让混音听起来更宽，削减 Side 可以让中心更聚焦。',
        principles: [
            'M/S 编码：将 L/R 转换为 M/S 域，再分别处理后转回 L/R',
            '宽度 100% = 原始，>100% 加宽，<100% 收窄，0% = 单声道',
            '频率相关宽度：只在高频加宽，低频保持 M 单声道兼容最好'
        ],
        tips: [
            '母带上 Side 的低频（<200Hz）最好切掉，否则在单声道系统上贝斯会消失',
            '加宽后务必在单声道下检查相位和电平'
        ]
    },
    {
        id: 'panning-law',
        name: '声像法则',
        nameEn: 'Pan Law',
        category: 'spatial',
        icon: '⚖️',
        letter: 'S',
        shortDesc: '描述信号从中间移到两侧时，在单声道下听音的电平补偿规则。',
        description: 'Pan Law 是为了让声像移动时主观音量不变而设计的。当你把一个信号从中间 Pan 到最左/右时，在理想立体声音响系统上实际会听起来更响一些（因为两只喇叭相干叠加），Pan Law 通过在中心位置衰减 3dB 或 6dB 来补偿这个效应。',
        principles: [
            '0dB Pan Law：中心不衰减，适合在耳机或控制室确认',
            '3dB Pan Law：最常用，适合大多数监听环境',
            '6dB Pan Law：补偿激进，适合单声道广播环境'
        ]
    },
    /* === 信号处理 === */
    {
        id: 'sidechain',
        name: '侧链压缩',
        nameEn: 'Sidechain Compression',
        category: 'processing',
        icon: '🔗',
        letter: 'C',
        shortDesc: '用 A 信号的电平来控制对 B 信号的压缩，电子舞曲中底鼓"推动"贝斯的经典技巧。',
        description: '普通压缩器用的是自己输入信号的电平来触发压缩，而侧链压缩用的是另一条"侧链输入"（Sidechain Input）的信号来触发。最经典的用法是底鼓触发贝斯的压缩，每次底鼓落下时贝斯自动变小一点，低频就不会打架，节奏感也更"抽"。',
        principles: [
            '触发源（Trigger）：决定何时压缩的信号，例如 Kick',
            '被处理源（Source）：被压缩的对象，例如 Bass',
            '压缩参数通常使用：快速 Attack（5-20ms），释放与节奏同步'
        ],
        useCases: [
            'Kick ↔ Bass：EDM / House 的招牌 Pumping 效果',
            '主唱 ↔ 混响/延迟：让空间效果不盖住主唱字',
            '底鼓 ↔ 底鼓 Reverb：保持低频清晰度',
            '播客的背景乐 ↔ 人声：说话时音乐自动变小（Ducking）'
        ],
        tips: [
            '释放时间最好和歌曲 BPM 对应，让压缩在 Kick 之间刚好抬起',
            '不要只看 Gain Reduction 表，用耳朵听 Pumping 是否自然'
        ]
    },
    {
        id: 'busing',
        name: '总线/编组',
        nameEn: 'Busing / Grouping',
        category: 'processing',
        icon: '🔀',
        letter: 'Z',
        shortDesc: '将多轨信号路由到同一辅助总线，统一加效果/调整，提升效率和融合度。',
        description: '总线（Bus）技术是混音师效率的关键。与其在 8 条背景人声上分别加相同的 EQ 和压缩，不如把它们发送到一条"背景人声母线"（BG Vocal Bus）上统一处理——不仅操作少了，而且这些人声经过同样处理后会"融合"在一起，听起来更像一个整体。',
        principles: [
            'Drum Bus：所有鼓组轨发送到一条总线，整体加压缩/EQ/饱和',
            'Vocal Bus：主唱、双轨、和声发送到同一条母线',
            'Instrument Bus：管弦乐或合成器编组',
            'Mix Bus：所有轨道汇聚的最后一条立体声总线，也是通向母带的出口'
        ],
        techniques: [
            '并行压缩（Parallel Compression / New York 压缩）：把原音和重度压缩的复制音混合，保留瞬态的同时获得厚度',
            'Send/Return 效果：混响和延迟不应该插在每条轨上，应该用 Aux Return 总线共享',
            'VCA 推子：使用 VCA 组控制一组轨道的电平而不改变路由'
        ],
        tips: [
            '每个 Drum Subgroup 都值得花时间单独调：Kick、Snare、Toms、OH、Room',
            'Mix Bus 上的轻微压缩（1-3dB GR）会让整个混音更有凝聚力'
        ]
    },
    {
        id: 'gain-staging',
        name: '增益分级',
        nameEn: 'Gain Staging',
        category: 'processing',
        icon: '📈',
        letter: 'Z',
        shortDesc: '在混音的每个节点保持健康的电平，避免数字削波和信噪比恶化的基础技术。',
        description: '增益分级是混音最容易被忽视但决定成败的底层基本功。它指的是在信号流经每个插件、每条总线时，把它们的输入/输出电平控制在合理范围内（通常 -18dBFS 左右为基准）。Gain Staging 做不好，后面怎么调都不对。',
        principles: [
            '数字系统基准电平：通常 -18dBFS ≈ 模拟 0VU',
            '单轨峰值建议：-18 ~ -10dBFS，给总线留足 Headroom',
            '总线输出峰值：-6 ~ -3dBFS，给母带处理留出空间',
            '每个插件的输入/输出都应保持在插件的 "Sweet Spot"'
        ],
        steps: [
            '1. 导入素材后先把每条轨的电平推到一个合理的起点（Kick -10dBFS 左右）',
            '2. 调整 Trim / Clip Gain 让每个插件 Input 在 -18dBFS 左右',
            '3. 每加一个插件检查 Output，必要时用 Output/Make-up Gain 补偿',
            '4. 混音总线峰值不超过 -3dBFS，避免过度推子'
        ],
        tips: [
            '不要用通道推子修复 Trim，推子是用来做平衡（Balance）的',
            '电平表选择：看 RMS/响度而不是只看 Peak，峰值高不代表响'
        ]
    },
    {
        id: 'mastering',
        name: '母带处理',
        nameEn: 'Mastering',
        category: 'processing',
        icon: '💿',
        letter: 'M',
        shortDesc: '混音完成后的最后一步： EQ、压缩、限幅、响度，让音乐在所有系统上听起来都好听。',
        description: '母带是音乐发行前的最后一道工序。母带师会用极其精准的监听和高品质的母带级 EQ、压缩、限制器，对整首歌进行微调整体音色、控制动态、提升响度、确保在从手机扬声器到 Club 音响的各种播放系统上声音都表现良好。',
        principles: [
            '少即是多：母带不是"修混音"，每步处理增益变化大多在 1-3dB',
            '顺序参考：EQ → 轻度压缩 → 饱和 → 限制器',
            'Headroom：混音给母带至少留 3-6dB 的峰值余量',
            '响度标准：Spotify -14LUFS，Apple Music -16LUFS，广播 -23LUFS'
        ],
        chain: [
            'Input Gain / Trim：确定正确输入电平',
            'EQ（线性相位/最小相位）：高频 0.5-1dB 提升，低频修整',
            'Stereo Compressor（Bus 压缩）：Ratio 2:1，Attack 慢，GR 1-3dB',
            'Stereo Widener：高频加宽，低频不变',
            'Saturator / Exciter：给高频一点"Air"',
            'Limiter：提升响度，Ceiling 通常 -0.3dBTP',
            'Dithering（抖动）：24-bit→16-bit 时加入，改善量化噪声'
        ],
        tips: [
            '母带处理永远和参考曲（Reference Track）对比',
            '检查在耳机、音响、手机、车机等多种设备的表现',
            '追求好听的响度，而不是最大的响度'
        ]
    },
    {
        id: 'automation',
        name: '自动化',
        nameEn: 'Automation',
        category: 'processing',
        icon: '🤖',
        letter: 'Z',
        shortDesc: '录制推子/插件参数随时间的变化，实现动态化的、有生命的混音。',
        description: '如果整个混音从头到尾参数都一样，那听起来是"死"的。自动化允许你让副歌部分推子大一点点，让主唱在长音结束前稍微拉起来一点点，让 Delay 只在某一句出现——这些微小的动态变化，是好混音和顶级混音的差别。',
        modes: [
            'Read（只读）：播放已录制的自动化',
            'Write（写入）：覆盖原有自动化并重新录制',
            'Touch（触摸）：只有你碰到推子时才录制',
            'Latch（锁存）：一旦碰到推子就一直录制到停止',
            'Trim（修剪）：在原有自动化上叠加微调'
        ],
        useCases: [
            'Vocal Ride：每个字的音量都手动推一遍，比压缩更自然',
            '副歌整体提升 1-2 dB 制造兴奋感',
            '某些特定词的 Send 量增加，只在那一下出现混响/延迟尾音',
            'Bridge 段拉下某些乐器，突出主唱'
        ]
    },
    {
        id: 'phase',
        name: '相位与相干',
        nameEn: 'Phase & Coherence',
        category: 'processing',
        icon: '〰️',
        letter: 'X',
        shortDesc: '多麦克风/重叠信号间的相位关系，相位抵消会让低频消失、音色空洞。',
        description: '当两个相同频率但有时间差的信号混合时，波形会发生叠加或抵消：同相叠加变响，反相抵消变弱。在录制底鼓时用了两只麦（内+外）、军鼓上下麦、吉他 DI+Mic 等场景都可能出现相位问题。',
        principles: [
            '3:1 原则：两只麦距离之比大于 3:1 时相位问题较小',
            '极性反转（Polarity Flip / Ø）：180 度反相，有时能修补抵消问题',
            'All-pass Filter（全通滤波）：只改相位不改振幅，精细对齐相位',
            '检查方式：把两条轨 Solo，同时按下 Ø 按钮，听起来更响更饱满的就是对的'
        ],
        tips: [
            '底鼓 Inside Mic 和 Outside Mic 几乎总要做相位对齐',
            '用延迟插件或手动拖曳音频块对齐波形是比 Ø 按钮更精确的做法'
        ]
    }
];

const MECHANICS_TABS = [
    {
        id: 'workflow',
        name: '混音工作流',
        nameEn: 'Mix Workflow',
        icon: '📋',
        sections: [
            {
                title: '专业混音师的典型工作流程',
                paragraphs: [
                    '混音不是随机拧旋钮，而是一套有逻辑、有层次的渐进流程。不同混音师有各自偏好，但基本遵循「准备 → 平衡 → 处理 → 空间 → 收尾」的大框架。'
                ],
                steps: [
                    {
                        num: 'STEP 01',
                        title: '准备与素材整理',
                        desc: '导入分轨 → 标记歌曲结构（Verse/Chorus/Bridge）→ 检查命名 → 按乐器类型整理到文件夹/颜色标记 → 做 Gain Staging，设置 -18dBFS 基准。'
                    },
                    {
                        num: 'STEP 02',
                        title: '静态推子平衡',
                        desc: '在不加任何效果的前提下，用推子和 Pan 做出一个完整的、已经"差不多好听"的版本。这一步决定 80% 的混音。'
                    },
                    {
                        num: 'STEP 03',
                        title: '修音与编辑',
                        desc: '对齐节拍（Beat Detective / Flex）→ 修音高（Melodyne / Auto-Tune）→ 降噪 → 剪掉呼吸声和爆音。'
                    },
                    {
                        num: 'STEP 04',
                        title: '音色塑造 (EQ + Saturation)',
                        desc: '用减性 EQ 切掉每条轨的垃圾频段 → 给贝斯、人声、军鼓做关键频段的提升 → 每条轨加轻微饱和增加质感。'
                    },
                    {
                        num: 'STEP 05',
                        title: '动态处理 (Comp/Gate)',
                        desc: '底鼓/军鼓/贝斯/人声分别加合适的压缩 → 鼓组开噪声门清理串音 → 并行压缩增加厚度。'
                    },
                    {
                        num: 'STEP 06',
                        title: '空间构建 (Reverb + Delay)',
                        desc: '设置 Send 轨：小 Room、中 Plate、大 Hall、若干 Delay → 为每件乐器分配合适的空间感，靠前的 Send 少，靠后的 Send 多。'
                    },
                    {
                        num: 'STEP 07',
                        title: '自动化 Ride',
                        desc: '手动 Ride 主唱每个字 → 副歌整体推起 1-2dB → 效果器 Send 量做自动化点缀 → 最后检查 Outro 渐弱。'
                    },
                    {
                        num: 'STEP 08',
                        title: '总线与导出',
                        desc: 'Mix Bus 加轻压缩和 EQ → 检查单声道兼容性 → 和参考曲 A/B → 导出 24-bit WAV 送母带。'
                    }
                ]
            }
        ]
    },
    {
        id: 'signal-flow',
        name: '信号流向',
        nameEn: 'Signal Flow',
        icon: '🔌',
        sections: [
            {
                title: '数字音频工作站 (DAW) 内部的信号路径',
                paragraphs: [
                    '理解信号流向是混音的底层心法。每当你插入一个插件、发送一条效果轨、做一条 Bus，你都是在重排信号流经的路径。',
                    '一条典型的 DAW 单轨信号流是按顺序从左到右经过每一个 Insert 插槽，再从推子流出后根据 Send 分配送往 Aux 轨或直接进入 Mix Bus。'
                ],
                lists: [
                    '「插入 (Insert)」是串联处理：过了第一个插件才进第二个，顺序会影响音色（EQ 前加压缩 vs EQ 后加压缩，结果完全不同）',
                    '「发送 (Send)」是并联处理：原信号和发送出去的信号最后再混合，所以混响和延迟通常用 Send 做',
                    '「编组 (Group / Folder Stack)」把多轨先汇集到一条中间 Bus，再进总输出，方便统一处理',
                    '「侧链 (Sidechain)」让别的轨道的电平来控制本轨道处理器的触发'
                ]
            },
            {
                title: '插件顺序的黄金法则',
                paragraphs: ['对人声轨而言，插件顺序通常是：'],
                lists: [
                    '修音高 / 修时值（Melodyne, Auto-Tune）',
                    '降噪（RX, DeNoise）',
                    '高通滤波 / Subtractive EQ（切除箱声、浑浊）',
                    'De-Esser（先压齿音，避免后续压缩把齿音再顶起来）',
                    '第一级压缩（控制大动态，Optical/VCA）',
                    'Additive EQ（提升空气感、低频饱满度）',
                    '饱和/失真（增加谐波、质感）',
                    '第二级压缩 / Limiter（把电平钉死在总线需要的范围）',
                    '最后是 Pan + 推子'
                ]
            }
        ]
    },
    {
        id: 'balance',
        name: '频率与平衡',
        nameEn: 'Frequency Balance',
        icon: '🎚️',
        sections: [
            {
                title: '频谱金字塔：每个频段的职责',
                paragraphs: [
                    '好的混音在 20Hz 到 20kHz 的全频段上都既有内容又不过量。把频谱想像成一座金字塔，底宽顶窄，低频最占能量、最容易出问题，高频决定"空气感"和"细节"。'
                ],
                params: [
                    { name: '20Hz ~ 60Hz 次低频 (Sub)', range: 'Kick Sub, 808', desc: '身体感受的震动，不能太多否则混音糊' },
                    { name: '60Hz ~ 250Hz 低频 (Low)', range: 'Kick Body, Bass', desc: '温暖与力度，过多会浑浊' },
                    { name: '250Hz ~ 2kHz 中低频 (Low Mid)', range: 'Guitar Low, Vocal Chest', desc: '箱声/泥区，常需削减' },
                    { name: '2kHz ~ 5kHz 中高频 (Presence)', range: 'Vocal Presence, Snare Attack', desc: '清晰度和攻击性，过多刺耳' },
                    { name: '5kHz ~ 10kHz 高频 (Treble)', range: 'Vocal Air, Cymbal Splash', desc: '明亮度和细节，过多疲劳' },
                    { name: '10kHz ~ 20kHz 超高频 (Air)', range: 'Sibilance, Hi-Hat Sparkle', desc: '空气感和空间感' }
                ]
            },
            {
                title: '避免频率冲突的核心策略',
                lists: [
                    '贝斯和底鼓分地盘：让 Kick 占 60-80Hz，Bass 占 80-200Hz，用 Sidechain 或 EQ  carving 避让',
                    '主唱和电吉他打架时，在吉他 1-3kHz 处削 1-3dB，给人声让出存在频段',
                    '每种乐器最多只让它在一两个关键频段"领先"，不要所有东西都想突出',
                    '参考频谱分析工具（SPAN, iZotope Ozone）但不要迷信数值，耳朵优先'
                ]
            }
        ]
    },
    {
        id: 'vocal',
        name: '人声处理',
        nameEn: 'Vocal Processing',
        icon: '🎤',
        sections: [
            {
                title: '让主唱脱颖而出的经典链条',
                paragraphs: ['人声是流行歌的灵魂。一条专业的人声链通常如下：'],
                steps: [
                    { num: '①', title: 'Tuning / Timing', desc: '用 Melodyne 或 Auto-Tune 做微修，保留演唱的呼吸感' },
                    { num: '②', title: 'Clean-Up EQ', desc: 'HPF 80Hz 以下 → 切 200-400Hz 的箱声/鼻音 → 切 2-4kHz 的刺耳点' },
                    { num: '③', title: 'De-Esser', desc: '处理 4-8kHz 的齿音，Solo 下听不出明显齿音为准' },
                    { num: '④', title: '第一级压缩', desc: 'Opto 或 1176 风格，Attack 20ms, Release 150ms, Ratio 3:1, GR 3-6dB' },
                    { num: '⑤', title: '增色 EQ', desc: '100Hz+ 厚底，2-5kHz+ 清晰度，10-16kHz+ 空气感' },
                    { num: '⑥', title: 'Saturation', desc: '轻微 Tube Sat，增加温暖和质感' },
                    { num: '⑦', title: '第二级压缩 / Limiter', desc: '更慢的压缩，GR 2-3dB，把整体电平钉稳' },
                    { num: '⑧', title: '空间效果', desc: 'Send 到一个短 Plate 混响 + 一个 1/8 或 Dotted 延迟' },
                    { num: '⑨', title: '自动化 Ride', desc: '逐字逐句手动 Ride，这是专业和业余的分水岭' }
                ]
            },
            {
                title: '背景人声与和声',
                lists: [
                    '背景人声通常 HPF 到 150Hz，不要抢贝斯的空间',
                    '和声可以 Pan 开到 L40 / R40，增加包围感',
                    '背景人声 Bus 可以加更重的压缩和合唱，让它们变成一块厚垫而不是多条独立人声'
                ]
            }
        ]
    },
    {
        id: 'drum',
        name: '鼓组处理',
        nameEn: 'Drum Processing',
        icon: '🥁',
        sections: [
            {
                title: '多麦克风鼓组的处理逻辑',
                paragraphs: ['鼓组是混音里轨数最多、相位问题最严重、动态最大的部分。现代流行/摇滚鼓组通常有 10-20 条分轨，处理时必须遵循清晰的分层逻辑。'],
                lists: [
                    '底鼓 (Kick)：Inside Mic 给攻击点(2-4kHz)，Outside Mic 给低频肥度(60-80Hz)，做相位对齐 → Gate → 压缩 → EQ',
                    '军鼓 (Snare)：Top Mic + Bottom Mic（Bottom 通常反相）→ 采样叠加（可选）→ 压缩（Attack 稍慢保留打击感）',
                    '通鼓 (Toms)：Gate → 中频削减 → 共振提升 → Bus 压缩',
                    'Overheads (OH)：决定镲片和整体鼓空间，HPF 到 300Hz 左右，给高频一点空气',
                    'Room Mic：加 Band Pass + 失真/饱和 + 重度压缩，得到"张牙舞爪"的氛围',
                    'Drum Bus：所有鼓轨汇合后，并行压缩（New York Style），统一加 EQ 和 Tape Sat'
                ]
            }
        ]
    }
];

const SIGNAL_FLOW_NODES = [
    { name: '输入音源', nameEn: 'Input', icon: '🎸' },
    { name: '修音与降噪', nameEn: 'Tune & Denoise', icon: '🧹' },
    { name: '增益分级', nameEn: 'Gain Stage', icon: '📏' },
    { name: '均衡器', nameEn: 'EQ', icon: '📊' },
    { name: '压缩器', nameEn: 'Compressor', icon: '🎚️' },
    { name: '饱和/失真', nameEn: 'Saturation', icon: '🔥' },
    { name: '混响/延迟', nameEn: 'Reverb & Delay', icon: '🏛️' },
    { name: '声像/推子', nameEn: 'Pan & Fader', icon: '↔️' },
    { name: '总线处理', nameEn: 'Mix Bus', icon: '🔀' },
    { name: '母带导出', nameEn: 'Mastering', icon: '💿' }
];

const HISTORY_TIMELINE = [
    {
        year: '1877',
        era: '前电子时代',
        title: '爱迪生发明留声机 · 录音诞生',
        description: '托马斯·爱迪生发明了第一台可以录音和回放的装置——锡箔留声机（Phonograph）。这是人类首次能够储存并复现声音。录制和回放都完全是机械过程，没有任何电子放大，录音师只能靠声源的位置和强度来做"混音"。',
        tags: ['机械录音', '声学时代', '录音起源']
    },
    {
        year: '1925',
        era: '电声革命',
        title: '贝尔实验室电气录音技术问世',
        description: '贝尔实验室将麦克风、电子管放大器和动圈式唱头引入录音流程，诞生了电气录音（Electrical Recording）。音量和动态范围大大提升，工程师第一次可以通过电子电路来调整不同话筒的音量比例——这就是最早的"混音台"雏形。',
        tags: ['电子管', '麦克风', '混音台始祖']
    },
    {
        year: '1940s',
        era: '磁带时代启动',
        title: '德军磁带技术战后公开 · 多轨成为可能',
        description: '二战期间德国人秘密研发了磁带录音机（Magnetophon），战后技术被带到美国。Ampex 公司在 Bing Crosby 的资助下造出了美国第一台商业磁带机。磁带允许编辑、叠录、反复播放，为真正的多轨录音奠定了物理基础。',
        tags: ['Ampex', '磁带', 'Les Paul']
    },
    {
        year: '1955',
        era: '多轨录音诞生',
        title: 'Les Paul 发明 8 轨磁带机 · Sel-Sync 技术',
        description: '吉他大师兼发明家 Les Paul 与 Ampex 合作推出了第一款 8 轨磁带录音机（采用 Sel-Sync 可重录头技术）。艺术家第一次可以先录节奏组，然后一层层叠人声、吉他、管弦乐——现代分轨混音（Overdubbing）的范式彻底确立。',
        tags: ['Les Paul', '8-Track', 'Overdubbing']
    },
    {
        year: '1967',
        era: '模拟黄金时代',
        title: 'Sgt. Pepper · 4 轨做出的传奇',
        description: '披头士《Sgt. Pepper\'s Lonely Hearts Club Band》在 EMI Abbey Road 用 4 轨 Studer 机录制，混音师 Geoff Emerick 创造性地使用了多机同步、磁带速度变化、ADT（人工双追踪）、反转混响等实验性技巧，把"录音"变成了"创作"的一部分。',
        tags: ['The Beatles', 'Abbey Road', 'ADT', '创意混音']
    },
    {
        year: '1970s',
        era: '大型模拟控制台',
        title: 'SSL/Neve 等大型调音台称霸录音棚',
        description: '70 年代是大型模拟调音台的黄金年代：Neve 1073/1084 话放/EQ、SSL 4000E（内置电脑自动化和总线压缩）、API 550A EQ、Urei 1176、LA-2A、Pultec EQP-1A 等传奇硬件纷纷登场。这些设备的声音特质至今仍是插件建模的目标。',
        tags: ['Neve', 'SSL', '1176', 'LA-2A', 'Pultec']
    },
    {
        year: '1983',
        era: 'MIDI 时代',
        title: 'MIDI 协议发布 · 合成器加入混音',
        description: 'MIDI (Musical Instrument Digital Interface) 标准统一了电子乐器之间的通信。合成器、鼓机（Roland TR-808/909, LinnDrum）开始大量进入混音工程。工程师需要同时处理声学乐器、模拟合成器和采样器，调音台从 24 轨扩展到 48 轨、96 轨。',
        tags: ['MIDI', '合成器', '808/909']
    },
    {
        year: '1991',
        era: '数字革命开始',
        title: 'Pro Tools 发布 · DAW 时代开启',
        description: 'Digidesign 推出了 Sound Tools 的进阶版——Pro Tools，第一次让在个人电脑上进行 24 轨数字录音、剪辑、混音成为可能。数字音频工作站（Digital Audio Workstation）的出现彻底改变了音乐制作的工作方式，也打破了只有专业录音棚才能做音乐的门槛。',
        tags: ['Pro Tools', 'DAW', '数字音频']
    },
    {
        year: '1996',
        era: '插件元年',
        title: 'VST 插件标准发布 · 人人都有"虚拟设备"',
        description: 'Steinberg 发布 VST（Virtual Studio Technology）标准，让第三方能以软件形式开发效果器和虚拟乐器。最初的 Waves Q10、SSL Native 等插件质量还被诟病，但是数字混音的民主化齿轮已经开始转动。',
        tags: ['VST', 'Waves', '插件化']
    },
    {
        year: '2000s',
        era: '家用混音普及',
        title: '笔记本 + 声卡 + 麦克风 = 家庭工作室',
        description: '2000 年代后期，电脑算力飞跃和廉价声卡的出现，让"卧室制作人（Bedroom Producer）"群体爆发式增长。Ableton Live、FL Studio、Logic Pro 等 DAW 让电子舞曲（EDM）制作门槛急剧下降，Sidechain 压缩、采样混音成为电子音乐的基本语言。',
        tags: ['家庭工作室', 'EDM', 'Sidechain']
    },
    {
        year: '2010s',
        era: 'AI 浪潮前夕',
        title: '在线流媒体主导 · 响度战争终结',
        description: 'Spotify、Apple Music、YouTube 等平台开始使用基于 LUFS 的响度归一化（Loudness Normalization），迫使"响度战争"退潮——混音不必再被限制器砸平。同时，iZotope Ozone/Neutron 引入 AI 助手，自动为你推荐 EQ 和压缩参数。',
        tags: ['LUFS', '流式媒体', 'iZotope AI']
    },
    {
        year: '2020s',
        era: 'AI 原生混音',
        title: 'AI 混音师落地 · 端云协同混音',
        description: '以 Landr、iZotope AI Mastering、LALAL.AI、AudioShake 为代表的 AI 工具，已经能做到自动分轨、一键修音、自动母带等过去必须混音师手工完成的工作。未来的混音师更多是"AI 指挥官"，而不是每个推子都亲自去拧的角色。',
        tags: ['AI 母带', '自动分轨', '生成式音频']
    }
];
