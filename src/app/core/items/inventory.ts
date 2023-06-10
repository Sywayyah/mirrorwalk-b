import { ItemObject, ItemSlotType } from "./types";

export interface ExtendedSlotType {
  icon: string;
  name: string;
  slotType: ItemSlotType;
}

export class InventoryItems {
  private inventoryItemsMap: Map<ItemSlotType, ItemObject> = new Map();

  private equipedItemsSet: Set<ItemObject> = new Set();

  private static slotTypes: ItemSlotType[] = [
    ItemSlotType.Weapon,
    ItemSlotType.Armor,
    ItemSlotType.Amulet,
    ItemSlotType.Headgear,
    ItemSlotType.Shield,
    ItemSlotType.Boots,
  ];

  private static extendedSlotsMap: Map<ItemSlotType, ExtendedSlotType> = new Map([
    [ItemSlotType.Weapon, { slotType: ItemSlotType.Weapon, name: 'Weapon', icon: 'sword', }],
    [ItemSlotType.Armor, { slotType: ItemSlotType.Armor, name: 'Armor', icon: 'vest', }],
    [ItemSlotType.Amulet, { slotType: ItemSlotType.Amulet, name: 'Amulet', icon: 'gem-pendant', }],
    [ItemSlotType.Headgear, { slotType: ItemSlotType.Headgear, name: 'Headgear', icon: 'knight-helmet', }],
    [ItemSlotType.Shield, { slotType: ItemSlotType.Shield, name: 'Shield', icon: 'shield', }],
    [ItemSlotType.Boots, { slotType: ItemSlotType.Boots, name: 'Boots', icon: 'boot-stomp', }],
  ]);


  constructor() { }

  public static getSlotTypes(): ItemSlotType[] {
    return this.slotTypes;
  }

  public static getSlotExtendedInfo(slotType: ItemSlotType): ExtendedSlotType {
    return this.extendedSlotsMap.get(slotType)!;
  }

  public static filterItemsForSlot(slotType: ItemSlotType, items: ItemObject[]): ItemObject[] {
    return items.filter(item => item.baseType.slotType === slotType);
  }

  public equipItem(item: ItemObject): void {
    const itemType = item.baseType.slotType;

    const prevItem = this.inventoryItemsMap.get(itemType);

    this.inventoryItemsMap.set(itemType, item);

    if (prevItem) {
      this.equipedItemsSet.delete(prevItem);
    }

    this.equipedItemsSet.add(item);
  }

  public unequipItem(item: ItemObject): void {
    this.inventoryItemsMap.delete(this.getItemSlotType(item));
    this.equipedItemsSet.delete(item);
  }

  public unequipSlot(itemSlot: ItemSlotType): void {
    const itemInSlot = this.inventoryItemsMap.get(itemSlot);

    if (itemInSlot) {
      this.inventoryItemsMap.delete(itemSlot);
      this.equipedItemsSet.delete(itemInSlot);
    }
  }

  public getItemInSlot(slotType: ItemSlotType): ItemObject | null {
    return this.inventoryItemsMap.get(slotType) || null;
  }

  public isSlotEquipped(slotType: ItemSlotType): boolean {
    return this.inventoryItemsMap.has(slotType);
  }

  public getEquippedItems(): ItemObject[] {
    return [...this.equipedItemsSet];
  }

  private getItemSlotType(item: ItemObject<object>): ItemSlotType {
    return item.baseType.slotType;
  }
}
