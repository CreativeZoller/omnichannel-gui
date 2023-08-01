import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoleGuardService } from '@services/roleGuardService';

@Component({
  selector: 'vt-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  naviNode: any = [
    {
      title: 'Showing the dashboard',
      icon: 'home',
      label: 'Dashboard',
      route: '/dashboard',
      type: 'item',
      visible: true,
      children: [],
    },
    {
      title: 'Showing the message history between debtors and you',
      icon: 'forum',
      label: 'Communications',
      route: '/communications',
      type: 'item',
      visible: this.checkRole('OmniChannel.Communications.View'),
      children: [],
    },
    {
      title: 'Showing the human to human message requests',
      icon: 'record_voice_over',
      label: 'Requests',
      route: '/requests',
      type: 'item',
      visible: true,
      children: [],
    },
    {
      title: 'Showing the command configurations',
      icon: 'comment',
      label: 'Commands',
      route: '/commands',
      type: 'item',
      visible: this.checkRole('OmniChannel.Commands.View'),
      children: [],
    },
    {
      title: 'Showing the tools menu options',
      icon: 'home_repair_service',
      label: 'Tools',
      menuid: '400',
      type: 'array',
      breadcrumbs: [
        {
          title: 'Go back',
          label: 'Tools',
          menuid: [],
        },
      ],
      children: [
        {
          title: 'Showing the command search tool',
          icon: 'search',
          label: 'Commands search',
          route: '/commandsearch',
          type: 'item',
          visible: this.checkRole('OmniChannel.Commands.View'),
          children: [],
        },
        {
          title: 'Showing the verification tool',
          icon: 'domain_verification',
          label: 'Verification tools',
          route: '/verification',
          type: 'item',
          visible: this.checkRole('OmniChannel.VerificationTool.View'),
          children: [],
        },
        {
          title: 'Showing the communication templates',
          icon: 'upcoming',
          label: 'Commmunication templates',
          route: '/communication-templates',
          type: 'item',
          visible: true,
          children: [],
        },
        {
          title: 'Showing the users managament tool',
          icon: 'people_alt',
          label: 'Manage Users',
          route: '/manageusers',
          type: 'item',
          visible : true,
          children: [],
        },
      ],
    },
  ];

  nestedHolder = '#mp-level-';
  clickEvents = '';

  constructor(private router: Router, private roleGuard: RoleGuardService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          const activeItem = document.querySelector('.list-group-item-action.active') as HTMLElement;
          if (activeItem == null) {
            return;
          }
          const parents = this.getParents(activeItem, 'nav');
          this.checkActiveItem(parents);
        }, 1000);
      }
    });
  }

  checkRole(role: string): boolean {
    return this.roleGuard.hasClaim(role);
  }

  public getParents(elem, limit) {
    const parents = [];
    while (elem.parentNode && elem.parentNode.nodeName.toLowerCase() !== limit) {
      elem = elem.parentNode;
      parents.push(elem);
    }
    const newParents = parents.filter((element) => {
      return element.tagName === 'DIV';
    });
    newParents.reverse();
    return newParents;
  }

  public checkActiveItem(array) {
    array.forEach((value) => {
      const menuId = value.id.substring(value.id.length - 3);
      this.activateNest(menuId);
    });
  }

  public toggleNest(level: string) {
    const nestedMenu = this.nestedHolder + level;
    const nestedMenuDOM = document.querySelector(nestedMenu);
    const wrapper = document.querySelector('.wrapper');
    const toggleBtn: HTMLElement = document.querySelector('#menu-toggle') as HTMLElement;
    const deviceWidth = window.innerWidth;

    if (wrapper.classList.contains('toggled') && deviceWidth > 768) {
      toggleBtn.click();
      nestedMenuDOM.classList.toggle('active');
    } else {
      nestedMenuDOM.classList.toggle('active');
    }
  }

  public activateNest(level: string) {
    const nestedMenu = this.nestedHolder + level;
    const nestedMenuDOM = document.querySelector(nestedMenu);
    if (!nestedMenuDOM.classList.contains('active')) {
      nestedMenuDOM.classList.toggle('active');
    }
  }

  public isNested(MenuItemType: string) {
    let isNestedItem: boolean;
    if (MenuItemType === 'item') {
      isNestedItem = false;
    } else {
      isNestedItem = true;
    }
    return isNestedItem;
  }

  public async isClickable(menuId: string) {
    if (menuId) {
      for (const item of menuId) {
        this.toggleNest(item);
        await new Promise((resolve) => setTimeout(resolve, 70));
      }
    }
  }
}
