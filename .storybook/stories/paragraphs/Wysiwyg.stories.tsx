import type {Meta, StoryObj} from '@storybook/react';
import WysiwygParagraph from "@components/paragraphs/stanford-wysiwyg/wysiwyg-paragraph";
import {ComponentProps} from "react";
import {ParagraphStanfordWysiwyg, Text} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof WysiwygParagraph> & {
  text: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Paragraphs/Wysiwyg',
  component: WysiwygParagraph,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Wysiwyg: Story = {
  render: ({text, ...args}) => {
    return <WysiwygParagraph paragraph={{suWysiwygText: {processed: text}} as ParagraphStanfordWysiwyg}/>
  },
  args: {
    text: "<h1>Didn't melt fairer keepsakes since Fellowship elsewhere.</h1>\n" +
      "<h1><a href=\"#\">Didn't melt fairer keepsakes since Fellowship elsewhere.</a></h1>\n" +
      "<p>Woodlands payment Osgiliath tightening. Barad-dur follow belly comforts tender tough bell? Many that live deserve death. Some that die deserve life. Outwitted teatime grasp defeated before stones reflection corset seen animals Saruman's call?</p>\n" +
      "<h2>Tad survive ensnare joy mistake courtesy Bagshot Row.</h2>\n" +
      "<h2><a href=\"#\">Tad survive ensnare joy mistake courtesy Bagshot Row.</a></h2>\n" +
      "<p>Ligulas step drops both? You shall not pass! Tender respectable success Valar impressive unfriendly bloom scraped? Branch hey-diddle-diddle pony trouble'll sleeping during jump Narsil.</p>\n" +
      "<h3>North valor overflowing sort Iáve mister kingly money?</h3>\n" +
      "<h3><a href=\"#\">North valor overflowing sort Iáve mister kingly money?</a></h3>\n" +
      "<p>Curse you and all the halflings! Deserted anytime Lake-town burned caves balls. Smoked lthilien forbids Thrain?</p>\n" +
      "<ul>\n" +
      "  <li>Adamant.</li>\n" +
      "  <li>Southfarthing!</li>\n" +
      "  <li>Witch-king.</li>\n" +
      "  <li>Precious.</li>\n" +
      "  <li>Gaffer's!</li>\n" +
      "</ul>\n" +
      "<ul>\n" +
      "  <li>Excuse tightening yet survives two cover Undómiel city ablaze.</li>\n" +
      "  <li>Keepsakes deeper clouds Buckland position 21 lied bicker fountains ashamed.</li>\n" +
      "  <li>Women rippling cold steps rules Thengel finer.</li>\n" +
      "  <li>Portents close Havens endured irons hundreds handle refused sister?</li>\n" +
      "  <li>Harbor Grubbs fellas riddles afar!</li>\n" +
      "</ul>\n" +
      "<h3>Narsil enjoying shattered bigger leaderless retrieve dreamed dwarf.</h3>\n" +
      "<p>Ravens wonder wanted runs me crawl gaining lots faster! Khazad-dum surprise baby season ranks. I bid you all a very fond farewell.</p>\n" +
      "<ol>\n" +
      "  <li>Narsil.</li>\n" +
      "  <li>Elros.</li>\n" +
      "  <li>Arwen Evenstar.</li>\n" +
      "  <li>Maggot's?</li>\n" +
      "  <li>Bagginses?</li>\n" +
      "</ol>\n" +
      "<ol>\n" +
      "  <li>Concerning Hobbits l golf air fifth bell prolonging camp.</li>\n" +
      "  <li>Grond humble rods nearest mangler.</li>\n" +
      "  <li>Enormity Lórien merry gravy stayed move.</li>\n" +
      "  <li>Diversion almost notion furs between fierce laboring Nazgûl ceaselessly parent.</li>\n" +
      "  <li>Agree ruling um wasteland Bagshot Row expect sleep.</li>\n" +
      "</ol>\n" +
      "<h3>Ere answering track forests shards roof!</h3>\n" +
      "<p>Delay freezes Gollum. Let the Ring-bearer decide. Bagshot Row chokes pole pauses immediately orders taught éored musing three-day? Disease rune repel source fire Goblinses already?</p>\n" +
      "<table>\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th></th>\n" +
      "      <th>Dangers</th>\n" +
      "      <th>Playing</th>\n" +
      "      <th>Window</th>\n" +
      "      <th>Meaning</th>\n" +
      "      <th>Pace</th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr>\n" +
      "      <td>Current</td>\n" +
      "      <td>living</td>\n" +
      "      <td>odds</td>\n" +
      "      <td>charged</td>\n" +
      "      <td>heads</td>\n" +
      "      <td>felt</td>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <td>Inn</td>\n" +
      "      <td>climbing</td>\n" +
      "      <td>destroying</td>\n" +
      "      <td>overhead</td>\n" +
      "      <td>roll</td>\n" +
      "      <td>mud</td>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <td>Breath</td>\n" +
      "      <td>relevant</td>\n" +
      "      <td>éored</td>\n" +
      "      <td>hinges</td>\n" +
      "      <td>year</td>\n" +
      "      <td>signed</td>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <td>Accept</td>\n" +
      "      <td>threads</td>\n" +
      "      <td>name</td>\n" +
      "      <td>fitted</td>\n" +
      "      <td>precious</td>\n" +
      "      <td>attacked</td>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <td>Chief</td>\n" +
      "      <td>sails</td>\n" +
      "      <td>first-born</td>\n" +
      "      <td>pottery</td>\n" +
      "      <td>lever</td>\n" +
      "      <td>antagonize</td>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <td>Unoccupied</td>\n" +
      "      <td>victorious</td>\n" +
      "      <td>means</td>\n" +
      "      <td>lovely</td>\n" +
      "      <td>humble</td>\n" +
      "      <td>force</td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "  <tfoot>\n" +
      "    <tr>\n" +
      "      <td>kinsmen</td>\n" +
      "      <td>give</td>\n" +
      "      <td>walking</td>\n" +
      "      <td>thousand</td>\n" +
      "      <td>manners</td>\n" +
      "      <td>burning</td>\n" +
      "    </tr>\n" +
      "  </tfoot>\n" +
      "</table>\n" +
      "<h4>Afraid smithy Fellowship debt carven hooks.</h4>\n" +
      "<p>What about second breakfast? Nags runt near Lindir lock discover level? Andûril breathe waited flatten union.</p>\n" +
      "<blockquote>\n" +
      "  <p>You shall be the Fellowship of the Ring.</p>\n" +
      "  <footer>—Númenor, <cite>sweeter burned verse</cite></footer>\n" +
      "</blockquote>\n" +
      "<h5>Should Shirelings extraordinary spends poison's willing enchantment.</h5>\n" +
      "<p>I think we should get off the road. Penalty sight splintered Misty Mountain mithril? Unrest lasts rode league bears absence Bracegirdle athletic contract nice parent slowed?</p>\n" +
      "<pre>Pardon Concerning Hobbits rune goblins? Twitching figure including rightful Thorin's level! Worth tubers threats Hornburg deadliest? Unfold thumping shh wants Homely!</pre>\n" +
      "<h6>Improve drops absolutely tight deceit potent Treebeard startled!</h6>\n" +
      "<p>J.R.R. Tolkien 3000 uttered veins <q>roaring winds moaning flaming</q>. Meddle <ins>measure pure</ins> Samwise Gamgee business! <sub>Lied</sub> mistake Proudfoots pon. Instance 80 <dfn>morbid ceremonial plunge</dfn> Anor mad. Questions shells hangs noble Proudfoots <var>throws</var>. <mark>Rampart damage</mark> questions Chubbs 3000 conjurer? Single tempt peasants <strong>Bolg Athelas Mordor Wraiths Azog Undómiel</strong> mangler? <samp>Nori Giants Undómiel Rivendell</samp> spike posts took. Fool's Underhill boarded <cite>vanishing twilight unheard-of</cite>. <abbr>Presence</abbr> Dunland lamb lair. Barricade <sup>didn't</sup> feelings purring vine Morgoth. Distract Giants nearing champion <kbd>T</kbd>. Clothing titles quick bother <em>Arod Gloin Beren</em> troop? Balls crashing bastards <small>arrives precisely rascal</small> stubbornness Snowbourn. Hobbitses rose barren <a>strengths tested mirrors moonlight password</a> center? Remade <x-code>free filthy</x-code> breaking respect amuse Arod? Vengeance <del>Elessar Wolves</del> posts remain doorway said! <time>Suspects</time> fight Merry hungers locked yelp.</p>\n" +
      "<hr>\n" +
      "<dl>\n" +
      "  <dt>Abandon</dt>\n" +
      "  <dd>Tact flies disturber thinking hospitality Elros act vest handy ranks.</dd>\n" +
      "  <dt>Devil</dt>\n" +
      "  <dd>Boneses spilled Caradhras hungry pace lanterns glory haunted shone forging.</dd>\n" +
      "  <dd>Unprotected Beorn's fireworks dream journey beacon dwells gnaws key.</dd>\n" +
      "  <dt>Happened</dt>\n" +
      "  <dd>Known wanna fifth Bill hell knew she scale.</dd>\n" +
      "  <dd>Missing vanish taken colleague sway voice tricks 13 Grimbold.</dd>\n" +
      "  <dd>Thereof skills kingsfoil innocent riding light Thorin Oakenshield won.</dd>\n" +
      "</dl>\n" +
      "<a href=\"#\" class=\"su-button\">Button</a>\n" +
      "<a href=\"#\" class=\"su-button--secondary\">Button</a>\n" +
      "<a href=\"#\" class=\"su-button--big\">Button</a>\n"
  },
};
