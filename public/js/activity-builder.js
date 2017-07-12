function ActivityBuilder() {
  this._markdown = new showdown.Converter();
  this._markdown.setOption('simpleLineBreaks', true);
}

/*
  Construct the main div from pre-built elements; used to bring everything together.
*/
ActivityBuilder.prototype._buildItemFromElements = function _buildItemFromElements(item, modType, divDesc) {
  var parent = document.createElement('DIV');

  parent.classList.add('phenom');
  parent.classList.add('mod-' + modType + '-type');

  this._addCreatorNode(parent, item);
  parent.appendChild(divDesc);
  this._addMetaNode(parent, item);

  return parent;
}

/*
  Creates a wrapper div that will contain the content which changes based on event type.
*/
ActivityBuilder.prototype._buildWrapperDiv = function _buildWrapperDiv(item) {
  var div = document.createElement('DIV');
  div.classList.add('phenom-desc');

  this._addInlineMemberNode(div, item.memberCreator.id, item.memberCreator.fullName);

  return div;
}

/*
  Convenience methods to add templated nodes to an existing (parent) element.
*/
ActivityBuilder.prototype._addCreatorNode = function _addCreatorNode(parent, item) {
  var creator = document.createElement('DIV'),
      member  = document.createElement('DIV');

  creator.classList.add('phenom-creator');

  member.classList.add('member');
  member.classList.add('js-show-mem-menu');
  member.id = item.memberCreator.id;

  if (typeof item.memberCreator.avatarHash != 'string' || item.memberCreator.avatarHash === "") {
    var newSpanMember = document.createElement('SPAN');
    var newSpanMemberText = document.createTextNode(item.memberCreator.initials);
    newSpanMember.classList.add('member-initials');
    newSpanMember.title = item.memberCreator.fullName + ' (' + item.memberCreator.username + ')';
    newSpanMember.appendChild(newSpanMemberText);
    member.appendChild(newSpanMember);
  } else {
    var newImgMember = document.createElement('IMG');
    newImgMember.classList.add('member-avatar');
    newImgMember.height = 30;
    newImgMember.width = 30;
    newImgMember.src = "https://trello-avatars.s3.amazonaws.com/" + item.memberCreator.avatarHash + "/30.png";
    newImgMember.alt = item.memberCreator.fullName + ' (' + item.memberCreator.username + ')';
    newImgMember.title = item.memberCreator.fullName + ' (' + item.memberCreator.username + ')';
    member.appendChild(newImgMember);
  }

  creator.appendChild(member);
  parent.appendChild(creator);
}

ActivityBuilder.prototype._addMetaNode = function _addMetaNode(parent, item) {
  var meta = document.createElement('P');

  meta.classList.add('phenom-meta');
  meta.classList.add('quiet');
  this._addTextNode(meta, (new Date(item.date)).toGMTString());

  parent.appendChild(meta);
}


ActivityBuilder.prototype._addAttachmentNode = function _addAttachmentNode(parent, item) {
  var attachment = document.createElement('A');
  attachment.classList.add('js-open-attachment-viewer');
  attachment.classList.add('js-friendly-links');

  if (typeof item.data.attachment.url === 'string') {
    attachment.href = item.data.attachment.url;
    attachment.target = '_blank';
    attachment.dataset.idattachment = item.data.attachment.id;
  }

  this._addTextNode(attachment, item.data.attachment.name);

  parent.appendChild(attachment);
}

ActivityBuilder.prototype._addTextNode = function _addTextNode(parent, text) {
  var child = document.createTextNode(text);
  parent.appendChild(child);
}

ActivityBuilder.prototype._addBoldTextNode = function _addBoldTextNode(parent, text) {
  var child = document.createElement('SPAN');
  child.classList.add('u-font-weight-bold');

  this._addTextNode(child, text);

  parent.appendChild(child);
}

ActivityBuilder.prototype._addInlineMemberNode = function _addInlineMemberNode(parent, memberId, memberName) {
  var child = document.createElement('SPAN');
  child.classList.add('inline-member');
  child.classList.add('js-show-mem-menu');
  child.idmember = memberId;

  this._addBoldTextNode(child, memberName);

  parent.appendChild(child);
}

ActivityBuilder.prototype._addCommentNode = function _addCommentNode(parent, text) {
  var container = document.createElement('DIV');
  container.classList.add('comment-container');

  var action = document.createElement('DIV');
  action.classList.add('action-comment');
  action.classList.add('markeddown');
  action.classList.add('js-comment');

  var comment = document.createElement('DIV');
  comment.classList.add('current-comment');
  comment.classList.add('js-friendly-links');
  comment.classList.add('js-open-card');

  comment.innerHTML = this._markdown.makeHtml(text);

  action.appendChild(comment);
  container.appendChild(action);
  parent.appendChild(container);
}


/*
  Main private quasi-constructors:
    Builds sub-DOMs for each kind of Trello activity/audit item.
*/
ActivityBuilder.prototype._buildGenericEntry = function _buildGenericEntry(item) {
  var div = this._buildWrapperDiv(item);
  var that = this;

  // First entry in entities is the member; this is already added by nodeDescriptionDiv. So slice to start from 1.
  item.entities.slice(1).forEach(function(ent) {
    if (ent.type === 'member') {
      that._addInlineMemberNode(div, ent.id, (div.textContent ? ' ' : '') + ent.text);
    } else {
      that._addTextNode(div, (div.textContent ? ' ' : '') + ent.text);
    }
  });

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildLargeEntry = function _buildLargeEntry(item, textAction, commentText) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' ' + textAction + ':');
  this._addCommentNode(div, commentText);

  return this._buildItemFromElements(item, 'comment', div);
}

ActivityBuilder.prototype._buildListChangeEntry = function _buildListChangeEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' moved this card to the ');
  this._addBoldTextNode(div, item.data.listAfter.name);
  this._addTextNode(div, ' list.');

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildNameChangeEntry = function _buildNameChangeEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' changed the name of this card to ');
  this._addBoldTextNode(div, item.data.card.name);
  this._addTextNode(div, '.');

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildPositionChangeEntry = function _buildPositionChangeEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' moved this card ' + item.entities[3].text + ' in the list.');

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildChecklistEntry = function _buildChecklistEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' ' + item.entities[1].text + ' the checklist ');
  this._addBoldTextNode(div, item.data.checklist.name);
  this._addTextNode(div, '.');

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildChecklistStateEntry = function _buildChecklistStateEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' marked the checklist item ');
  this._addBoldTextNode(div, item.data.checkItem.name);
  this._addTextNode(div, ' as ');
  this._addBoldTextNode(div, item.data.checkItem.state);
  this._addTextNode(div, '.');

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildChangeMembershipEntry = function _buildChangeMembershipEntry(item) {
  var div = this._buildWrapperDiv(item);

  if (item.member.id === item.memberCreator.id) {
    this._addTextNode(div, ' ' + item.entities[1].text + ' this card.');
  } else {
    this._addTextNode(div, ' ' + item.entities[1].text + ' ');
    this._addInlineMemberNode(div, item.member.id, item.member.fullName);
    this._addTextNode(div, ' ' + item.entities[3].text + ' this card.');
  }

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildErrorEntry = function _buildErrorEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, 'Error: Unable to parse item (type=' + item.type + ').')
  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildAddAttachmentEntry = function _buildAddAttachmentEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' attached ');
  this._addAttachmentNode(div, item);
  this._addTextNode(div, ' to this card.');

  return this._buildItemFromElements(item, 'attachment', div);
}

ActivityBuilder.prototype._buildDeleteAttachmentEntry = function _buildDeleteAttachmentEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' deleted the attachment ');
  this._addAttachmentNode(div, item);
  this._addTextNode(div, ' on this card.');

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildAddAttachmentCoverEntry = function _buildAddAttachmentCoverEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' updated the cover of this card.');

  return this._buildItemFromElements(item, 'other', div);
}

ActivityBuilder.prototype._buildDeleteAttachmentCoverEntry = function _buildDeleteAttachmentCoverEntry(item) {
  var div = this._buildWrapperDiv(item);

  this._addTextNode(div, ' removed the cover of this card.');

  return this._buildItemFromElements(item, 'other', div);
}

/*
  Main public interface:
    Detects what kind of activity this audit item refers to and calls the relevant 'constructor'.
*/
ActivityBuilder.prototype.makeItem = function makeItem(item) {
  if (item.type === 'createCard') {
    return this._buildGenericEntry(item);
  } else if (item.type === 'commentCard') {
    return this._buildLargeEntry(item, 'commented on this card', item.data.text);
  } else if (item.type === 'updateCard') {
    // updateCard encapsulates a lot of different changes; let's try to detect some.
    if (typeof item.data.listAfter === 'object' && typeof item.data.listBefore === 'object') {
      return this._buildListChangeEntry(item);
    } else if (typeof item.data.card.desc === 'string') {
      return this._buildLargeEntry(item, 'updated the description of this card', item.data.card.desc);
    } else if (typeof item.data.old.name === 'string') {
      return this._buildNameChangeEntry(item);
    } else if (typeof item.data.old.pos === 'number') {
      return this._buildPositionChangeEntry(item);
    } else if (typeof item.data.card.idAttachmentCover === 'string' && typeof item.data.card.idAttachmentCover === '') {
      return this._buildDeleteAttachmentCoverEntry(item);
    } else if (typeof item.data.card.idAttachmentCover === 'string') {
      return this._buildAddAttachmentCoverEntry(item);
    } else {
      return this._buildGenericEntry(item);
    }
  } else if (item.type === 'removeChecklistFromCard' || item.type === 'addChecklistToCard') {
    return this._buildChecklistEntry(item);
  } else if (item.type === 'updateCheckItemStateOnCard') {
    return this._buildChecklistStateEntry(item);
  } else if (item.type === 'addMemberToCard' || item.type === 'removeMemberFromCard') {
    return this._buildChangeMembershipEntry(item);
  } else if (item.type === 'addAttachmentToCard') {
    return this._buildAddAttachmentEntry(item);
  } else if (item.type === 'deleteAttachmentFromCard') {
    return this._buildDeleteAttachmentEntry(item);
  } else {
    return this._buildGenericEntry(item);
    // createCard, copyCard, maybe others
  }

  return this._buildErrorEntry(item);
}
